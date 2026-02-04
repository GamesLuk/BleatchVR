#include "LootBox.h"

#include "Bandages.h"
#include "GeometryCollection/GeometryCollectionComponent.h"

class URadialVector;

namespace {
	
	// Randomgenerator
	int RandomIntUnreal(int Min, int Max)
	{
		return FMath::RandRange(Min, Max);
	}
}

ALootBox::ALootBox()
{
 	// Tick every frame
	PrimaryActorTick.bCanEverTick = true;

	// Setup intact Mesh
	IntactMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("IntactMesh"));
	SetRootComponent(IntactMesh);

	IntactMesh->SetCollisionProfileName(TEXT("BlockAll"));
	IntactMesh->SetNotifyRigidBodyCollision(true);

	// Apply intact Mesh-Asset
	static ConstructorHelpers::FObjectFinder<UStaticMesh> IntactMeshAsset(
		TEXT("/Game/Fab/Megascans/3D/LootBox/High/ukqncf3bw_tier_1/StaticMeshes/LootBox.LootBox"));
	if (IntactMeshAsset.Succeeded())
		IntactMesh->SetStaticMesh(IntactMeshAsset.Object);
	
	// Setup fractured Mesh
	FracturedMesh = CreateDefaultSubobject<UGeometryCollectionComponent>(TEXT("FracturedMesh"));
	FracturedMesh->SetupAttachment(RootComponent);

	FracturedMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);	// No Collisions
	FracturedMesh->SetSimulatePhysics(false);	// No Physics
	FracturedMesh->SetVisibility(false);	// At first invisible
	
	// Apply fractured Mesh-Asset
	static ConstructorHelpers::FObjectFinder<UGeometryCollection> FracturedMeshAsset(
		TEXT("/Game/Fab/Megascans/3D/LootBox/High/ukqncf3bw_tier_1/StaticMeshes/GC_LootBox.GC_LootBox"));
	if (FracturedMeshAsset.Succeeded())
		FracturedMesh->SetRestCollection(FracturedMeshAsset.Object);
}

// Called when the game starts or when spawned
void ALootBox::BeginPlay()
{
	Super::BeginPlay();
	
	// Save current Transform
	InitialTransform = GetActorTransform();
	
	// Save current FracturedMesh
	OriginalCollection = const_cast<UGeometryCollection*>(
		FracturedMesh->GetRestCollection()
	);


	// Register Listener
	IntactMesh->OnComponentHit.AddDynamic(this, &ALootBox::OnTriggerHit);
}

// Called every frame
void ALootBox::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	if (RandomIntUnreal(1,spawnTickChance) == 1 && active) ShowLootBox();

}

// Hit-Handler
void ALootBox::OnTriggerHit(UPrimitiveComponent* HitComponent, AActor* OtherActor, 
	UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit
)
{
	if (!OtherActor) return;

	// Only destruct if tag "DestroyLootBox" is set
	if (!OtherActor->ActorHasTag("DestroyLootBox")) return;

	ExplodeLootBox();
}

// Explode and destruct
void ALootBox::ExplodeLootBox()
{
	// deactivate StaticMesh
	IntactMesh->SetVisibility(false);
	IntactMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);

	// activate GeometryCollection
	FracturedMesh->SetVisibility(true);
	FracturedMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);
	FracturedMesh->SetSimulatePhysics(true);

	// apply Chaos
	FracturedMesh->ApplyKinematicField(
		100000.f,
		GetActorLocation()
	);

	// Radial Force
	FracturedMesh->AddRadialImpulse(
		GetActorLocation(),
		300.f,
		ExplosionStrength,
		RIF_Linear,
		true
	);

	// Reset-Timer
	GetWorld()->GetTimerManager().SetTimer(
		ResetTimer,
		this,
		&ALootBox::ResetLootBox,
		ResetDelay,
		false
	);
}

// Make the lootbox visible
void ALootBox::ShowLootBox()
{
	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Green, TEXT("Show LootBox!"));
	
	SetActorHiddenInGame(false);
	SetActorEnableCollision(true);
}

// Make the lootbox invisible
void ALootBox::HideLootBox()
{
	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hide LootBox!"));

	SetActorHiddenInGame(true);
	SetActorEnableCollision(false);
}

// Reset the Chaos state
void ALootBox::ResetLootBox()
{
	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Cyan, TEXT("Reset LootBox"));

	// 1. Deactivate FracturedMesh
	FracturedMesh->SetSimulatePhysics(false);
	FracturedMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);
	FracturedMesh->SetHiddenInGame(true);

	// 2. Hard reset Chaos internal state
	FracturedMesh->SetRestCollection(nullptr);
	FracturedMesh->RecreatePhysicsState();

	// 3. Restore original collection
	FracturedMesh->SetRestCollection(OriginalCollection);
	FracturedMesh->RecreatePhysicsState();
	FracturedMesh->MarkRenderStateDirty();

	// 4. Reset Actor transform
	SetActorTransform(InitialTransform);
	
	HideLootBox();
}

void ALootBox::SpawnLoot()
{
	int randomCategory = RandomIntUnreal(1,100);
	int randomLevel = RandomIntUnreal(1,100);
	
	FActorSpawnParameters SpawnParams;
	SpawnParams.Owner = this;
	SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButAlwaysSpawn;

	FVector SpawnLocation = GetActorLocation() + FVector(0,0,100);
	FRotator SpawnRotation = FRotator::ZeroRotator;

	if (randomCategory <= 33)
	{
		// HP
		if (randomLevel <= 90)
		{
			// Bandages
			GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::White, TEXT("Spawn Bandages"));
		}
		else
		{
			// Medi-Kit
			GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::White, TEXT("Spawn Medi-Kit"));
		}
	} else if (randomCategory <= 66)
	{
		// XP
		if (randomLevel <= 80)
		{
			// Ancient Scroll
			GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::White, TEXT("Spawn Ancient Scroll"));
		}
		else if (randomLevel <= 90)
		{
			// Old Book
			GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::White, TEXT("Spawn Old Book"));
		}
		else
		{
			// Big Book
			GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::White, TEXT("Spawn Big Book"));
		}
	} else if (randomCategory <= 100)
	{
		// Energy
		if (randomLevel <= 80)
		{
			// Apple
			GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::White, TEXT("Spawn Apple"));
		}
		else if (randomLevel <= 90)
		{
			// Big Meat
			GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::White, TEXT("Spawn Big Meat"));
		}
		else
		{
			// Bread
			GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::White, TEXT("Spawn Bread"));
		}
	}
}

void ALootBox::SpawnBandages(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation)
{
	ABandages* NewActor = GetWorld()->SpawnActor<ABandages>(ABandages::StaticClass(), SpawnLocation, SpawnRotation, SpawnParams);
}
