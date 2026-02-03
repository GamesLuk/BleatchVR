// Fill out your copyright notice in the Description page of Project Settings.


#include "LootBox.h"

#include "Bandages.h"
#include "Field/FieldSystemObjects.h"
#include "GeometryCollection/GeometryCollectionComponent.h"

class URadialVector;

namespace {
	
	// Randomgenerator
	int RandomIntUnreal(int Min, int Max)
	{
		return FMath::RandRange(Min, Max);
	}
}

// Sets default values
ALootBox::ALootBox()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Setup Mesh (Destructible)
	Mesh = CreateDefaultSubobject<UGeometryCollectionComponent>(TEXT("Mesh"));
	RootComponent = Mesh;

	// Mesh-Asset zuweisen
	static ConstructorHelpers::FObjectFinder<UGeometryCollection> MeshAsset(TEXT("/Game/Fab/Megascans/3D/LootBox/High/ukqncf3bw_tier_1/StaticMeshes/GC_LootBox.GC_LootBox"));
	if (MeshAsset.Succeeded())
	{
		Mesh->SetRestCollection(MeshAsset.Object);
	}
	
}

// Called when the game starts or when spawned
void ALootBox::BeginPlay()
{
	Super::BeginPlay();
}

// Called every frame
void ALootBox::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	if (RandomIntUnreal(1,spawnTickChance) == 1 && active) ShowLootBox();

}

void ALootBox::ShowLootBox()
{
	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Green, TEXT("Show LootBox!"));
	if (Mesh)
	{
		Mesh->SetVisibility(true);
		Mesh->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);
	}

}

void ALootBox::ResetLootBox()
{
	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Hide LootBox!"));
	if (Mesh)
	{
		Mesh->SetVisibility(false);
		Mesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);
		Mesh->ResetState();
	}
}

void ALootBox::Destruct()
{
	if (Mesh)
	{
		// Enable simulation first
		Mesh->SetSimulatePhysics(true);

		// Break all clusters at once (INDEX_NONE = all clusters)
		Mesh->CrumbleCluster(INDEX_NONE);

		// Apply radial impulse for explosion effect
		Mesh->AddRadialImpulse(
			GetActorLocation(),  // Origin
			500.0f,              // Radius
			50000.0f,            // Strength
			RIF_Linear,
			true                 // Velocity change
		);

		// Reset after 2 seconds
		GetWorldTimerManager().SetTimer(
			ResetTimerHandle,
			this,
			&ALootBox::ResetLootBox,
			2.0f,
			false
		);
	}
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
