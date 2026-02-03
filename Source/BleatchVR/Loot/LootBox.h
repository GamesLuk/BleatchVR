// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "LootBox.generated.h"

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
	
	UFUNCTION(BlueprintCallable)
	void ShowLootBox();
	
	UFUNCTION(BlueprintCallable)
	void HideLootBox();
	
	void SpawnBandages(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnMedicKit(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnAncientScroll(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnOldBook(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnApple(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	void SpawnBigMeat(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation);
	
	// Mesh
	UPROPERTY()
	UGeometryCollectionComponent* Mesh;
    
    UFUNCTION(BlueprintCallable)
    void Destruct();
	
	UPROPERTY(EditAnywhere, Category="Spawning")
	int spawnTickChance;
	
	UPROPERTY(EditAnywhere, Category="Spawning")
	int active;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UFUNCTION(BlueprintCallable)
	void SpawnLoot();
	
};
