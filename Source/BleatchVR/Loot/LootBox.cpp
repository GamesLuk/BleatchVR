// Fill out your copyright notice in the Description page of Project Settings.


#include "LootBox.h"

#include "Bandages.h"

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
	
	if (RandomIntUnreal(1,spawnTickChance) == 1 && active) SpawnLoot();

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
		}
		else
		{
			// Medi-Kit
		}
	} else if (randomCategory <= 66)
	{
		// XP
		if (randomLevel <= 90)
		{
			// Ancient Scroll
		}
		else
		{
			// Old Book
		}
	} else if (randomCategory <= 100)
	{
		// Energy
		if (randomLevel <= 90)
		{
			// Apple
		}
		else
		{
			// Big Meat
		}
	}
}

void ALootBox::SpawnBandages(FActorSpawnParameters SpawnParams, FVector SpawnLocation, FRotator SpawnRotation)
{
	ABandages* NewActor = GetWorld()->SpawnActor<ABandages>(ABandages::StaticClass(), SpawnLocation, SpawnRotation, SpawnParams);
}
