// Copyright Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

#include "UObject/GeneratedCppIncludes.h"
PRAGMA_DISABLE_DEPRECATION_WARNINGS
void EmptyLinkFunctionForGeneratedCodeBleatchVR_init() {}
static_assert(!UE_WITH_CONSTINIT_UOBJECT, "This generated code can only be compiled with !UE_WITH_CONSTINIT_OBJECT");	BLEATCHVR_API UFunction* Z_Construct_UDelegateFunction_BleatchVR_BulletCountUpdatedDelegate__DelegateSignature();
	BLEATCHVR_API UFunction* Z_Construct_UDelegateFunction_BleatchVR_DamagedDelegate__DelegateSignature();
	BLEATCHVR_API UFunction* Z_Construct_UDelegateFunction_BleatchVR_PawnDeathDelegate__DelegateSignature();
	BLEATCHVR_API UFunction* Z_Construct_UDelegateFunction_BleatchVR_SprintStateChangedDelegate__DelegateSignature();
	BLEATCHVR_API UFunction* Z_Construct_UDelegateFunction_BleatchVR_UpdateSprintMeterDelegate__DelegateSignature();
	static FPackageRegistrationInfo Z_Registration_Info_UPackage__Script_BleatchVR;
	FORCENOINLINE UPackage* Z_Construct_UPackage__Script_BleatchVR()
	{
		if (!Z_Registration_Info_UPackage__Script_BleatchVR.OuterSingleton)
		{
		static UObject* (*const SingletonFuncArray[])() = {
			(UObject* (*)())Z_Construct_UDelegateFunction_BleatchVR_BulletCountUpdatedDelegate__DelegateSignature,
			(UObject* (*)())Z_Construct_UDelegateFunction_BleatchVR_DamagedDelegate__DelegateSignature,
			(UObject* (*)())Z_Construct_UDelegateFunction_BleatchVR_PawnDeathDelegate__DelegateSignature,
			(UObject* (*)())Z_Construct_UDelegateFunction_BleatchVR_SprintStateChangedDelegate__DelegateSignature,
			(UObject* (*)())Z_Construct_UDelegateFunction_BleatchVR_UpdateSprintMeterDelegate__DelegateSignature,
		};
		static const UECodeGen_Private::FPackageParams PackageParams = {
			"/Script/BleatchVR",
			SingletonFuncArray,
			UE_ARRAY_COUNT(SingletonFuncArray),
			PKG_CompiledIn | 0x00000000,
			0x40D84B68,
			0x5194A090,
			METADATA_PARAMS(0, nullptr)
		};
		UECodeGen_Private::ConstructUPackage(Z_Registration_Info_UPackage__Script_BleatchVR.OuterSingleton, PackageParams);
	}
	return Z_Registration_Info_UPackage__Script_BleatchVR.OuterSingleton;
}
static FRegisterCompiledInInfo Z_CompiledInDeferPackage_UPackage__Script_BleatchVR(Z_Construct_UPackage__Script_BleatchVR, TEXT("/Script/BleatchVR"), Z_Registration_Info_UPackage__Script_BleatchVR, CONSTRUCT_RELOAD_VERSION_INFO(FPackageReloadVersionInfo, 0x40D84B68, 0x5194A090));
PRAGMA_ENABLE_DEPRECATION_WARNINGS
