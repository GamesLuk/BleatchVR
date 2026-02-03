// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class BleatchVR : ModuleRules
{
	public BleatchVR(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[] {
			"Core",
			"CoreUObject",
			"Engine",
			"InputCore",
			"GeometryCollectionEngine",
			"ChaosSolverEngine",
			"FieldSystemEngine",
			"EnhancedInput",
			"AIModule",
			"StateTreeModule",
			"GameplayStateTreeModule",
			"UMG",
			"Slate"
		});

		PrivateDependencyModuleNames.AddRange(new string[] { });

		PublicIncludePaths.AddRange(new string[] {
			"BleatchVR",
			"BleatchVR/Variant_Horror",
			"BleatchVR/Variant_Horror/UI",
			"BleatchVR/Variant_Shooter",
			"BleatchVR/Variant_Shooter/AI",
			"BleatchVR/Variant_Shooter/UI",
			"BleatchVR/Variant_Shooter/Weapons"
		});

		// Uncomment if you are using Slate UI
		// PrivateDependencyModuleNames.AddRange(new string[] { "Slate", "SlateCore" });

		// Uncomment if you are using online features
		// PrivateDependencyModuleNames.Add("OnlineSubsystem");

		// To include OnlineSubsystemSteam, add it to the plugins section in your uproject file with the Enabled attribute set to true
	}
}
