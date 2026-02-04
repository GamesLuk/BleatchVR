// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "LootBox.generated.h"

class UGeometryCollection;

UCLASS()
class BLEATCHVR_API ALootBox : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ALootBox();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;
	
	// Hit-Handler
	UFUNCTION()
	void OnTriggerHit(
		UPrimitiveComponent* HitComponent,
		AActor* OtherActor,
		UPrimitiveComponent* OtherComp,
		FVector NormalImpulse,
		const FHitResult& Hit
	);
	
	// Make the lootbox visible
	UFUNCTION(BlueprintCallable)
	void ShowLootBox();
	
	// Make the lootbox invisible
	UFUNCTION(BlueprintCallable)
	void HideLootBox();
	
	// Reset Destruction
	UFUNCTION(BlueprintCallable)
	void ResetLootBox();
	
	// Explode the lootbox
	UFUNCTION(BlueprintCallable)
	void ExplodeLootBox();
	
	// Loot spawning functions
	void SpawnBandages(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnMedicKit(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnAncientScroll(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnOldBook(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnApple(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnBigMeat(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	
	// Meshes
	UPROPERTY(VisibleAnywhere)
	UStaticMeshComponent* IntactMesh;

	UPROPERTY(VisibleAnywhere)
	UGeometryCollectionComponent* FracturedMesh;
	
	UPROPERTY()
	UGeometryCollection* OriginalCollection = nullptr;
	
	// Chaos Destruction Vars
	FTransform InitialTransform;
	FTimerHandle ResetTimer;
	
	UPROPERTY(EditAnywhere, Category="Destruction")
	float ExplosionStrength = 2000.f;

	UPROPERTY(EditAnywhere, Category="Destruction")
	float ResetDelay = 3.f;
	
	// Spawn chance for the loot box if there ist space (1/x)
	UPROPERTY(EditAnywhere, Category="Spawning")
	int spawnTickChance;
	
	// (should be a global var)
	UPROPERTY(EditAnywhere, Category="Spawning")
	int active;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// (called later)
	UFUNCTION(BlueprintCallable)
	void SpawnLoot();
	
};
