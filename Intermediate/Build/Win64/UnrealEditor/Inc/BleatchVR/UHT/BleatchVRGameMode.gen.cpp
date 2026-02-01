// Copyright Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

#include "UObject/GeneratedCppIncludes.h"
#include "BleatchVRGameMode.h"

PRAGMA_DISABLE_DEPRECATION_WARNINGS
static_assert(!UE_WITH_CONSTINIT_UOBJECT, "This generated code can only be compiled with !UE_WITH_CONSTINIT_OBJECT");
void EmptyLinkFunctionForGeneratedCodeBleatchVRGameMode() {}

// ********** Begin Cross Module References ********************************************************
BLEATCHVR_API UClass* Z_Construct_UClass_ABleatchVRGameMode();
BLEATCHVR_API UClass* Z_Construct_UClass_ABleatchVRGameMode_NoRegister();
ENGINE_API UClass* Z_Construct_UClass_AGameModeBase();
UPackage* Z_Construct_UPackage__Script_BleatchVR();
// ********** End Cross Module References **********************************************************

// ********** Begin Class ABleatchVRGameMode *******************************************************
FClassRegistrationInfo Z_Registration_Info_UClass_ABleatchVRGameMode;
UClass* ABleatchVRGameMode::GetPrivateStaticClass()
{
	using TClass = ABleatchVRGameMode;
	if (!Z_Registration_Info_UClass_ABleatchVRGameMode.InnerSingleton)
	{
		GetPrivateStaticClassBody(
			TClass::StaticPackage(),
			TEXT("BleatchVRGameMode"),
			Z_Registration_Info_UClass_ABleatchVRGameMode.InnerSingleton,
			StaticRegisterNativesABleatchVRGameMode,
			sizeof(TClass),
			alignof(TClass),
			TClass::StaticClassFlags,
			TClass::StaticClassCastFlags(),
			TClass::StaticConfigName(),
			(UClass::ClassConstructorType)InternalConstructor<TClass>,
			(UClass::ClassVTableHelperCtorCallerType)InternalVTableHelperCtorCaller<TClass>,
			UOBJECT_CPPCLASS_STATICFUNCTIONS_FORCLASS(TClass),
			&TClass::Super::StaticClass,
			&TClass::WithinClass::StaticClass
		);
	}
	return Z_Registration_Info_UClass_ABleatchVRGameMode.InnerSingleton;
}
UClass* Z_Construct_UClass_ABleatchVRGameMode_NoRegister()
{
	return ABleatchVRGameMode::GetPrivateStaticClass();
}
struct Z_Construct_UClass_ABleatchVRGameMode_Statics
{
#if WITH_METADATA
	static constexpr UECodeGen_Private::FMetaDataPairParam Class_MetaDataParams[] = {
#if !UE_BUILD_SHIPPING
		{ "Comment", "/**\n *  Simple GameMode for a first person game\n */" },
#endif
		{ "HideCategories", "Info Rendering MovementReplication Replication Actor Input Movement Collision Rendering HLOD WorldPartition DataLayers Transformation" },
		{ "IncludePath", "BleatchVRGameMode.h" },
		{ "ModuleRelativePath", "BleatchVRGameMode.h" },
		{ "ShowCategories", "Input|MouseInput Input|TouchInput" },
#if !UE_BUILD_SHIPPING
		{ "ToolTip", "Simple GameMode for a first person game" },
#endif
	};
#endif // WITH_METADATA

// ********** Begin Class ABleatchVRGameMode constinit property declarations ***********************
// ********** End Class ABleatchVRGameMode constinit property declarations *************************
	static UObject* (*const DependentSingletons[])();
	static constexpr FCppClassTypeInfoStatic StaticCppClassTypeInfo = {
		TCppClassTypeTraits<ABleatchVRGameMode>::IsAbstract,
	};
	static const UECodeGen_Private::FClassParams ClassParams;
}; // struct Z_Construct_UClass_ABleatchVRGameMode_Statics
UObject* (*const Z_Construct_UClass_ABleatchVRGameMode_Statics::DependentSingletons[])() = {
	(UObject* (*)())Z_Construct_UClass_AGameModeBase,
	(UObject* (*)())Z_Construct_UPackage__Script_BleatchVR,
};
static_assert(UE_ARRAY_COUNT(Z_Construct_UClass_ABleatchVRGameMode_Statics::DependentSingletons) < 16);
const UECodeGen_Private::FClassParams Z_Construct_UClass_ABleatchVRGameMode_Statics::ClassParams = {
	&ABleatchVRGameMode::StaticClass,
	"Game",
	&StaticCppClassTypeInfo,
	DependentSingletons,
	nullptr,
	nullptr,
	nullptr,
	UE_ARRAY_COUNT(DependentSingletons),
	0,
	0,
	0,
	0x008002ADu,
	METADATA_PARAMS(UE_ARRAY_COUNT(Z_Construct_UClass_ABleatchVRGameMode_Statics::Class_MetaDataParams), Z_Construct_UClass_ABleatchVRGameMode_Statics::Class_MetaDataParams)
};
void ABleatchVRGameMode::StaticRegisterNativesABleatchVRGameMode()
{
}
UClass* Z_Construct_UClass_ABleatchVRGameMode()
{
	if (!Z_Registration_Info_UClass_ABleatchVRGameMode.OuterSingleton)
	{
		UECodeGen_Private::ConstructUClass(Z_Registration_Info_UClass_ABleatchVRGameMode.OuterSingleton, Z_Construct_UClass_ABleatchVRGameMode_Statics::ClassParams);
	}
	return Z_Registration_Info_UClass_ABleatchVRGameMode.OuterSingleton;
}
DEFINE_VTABLE_PTR_HELPER_CTOR_NS(, ABleatchVRGameMode);
ABleatchVRGameMode::~ABleatchVRGameMode() {}
// ********** End Class ABleatchVRGameMode *********************************************************

// ********** Begin Registration *******************************************************************
struct Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRGameMode_h__Script_BleatchVR_Statics
{
	static constexpr FClassRegisterCompiledInInfo ClassInfo[] = {
		{ Z_Construct_UClass_ABleatchVRGameMode, ABleatchVRGameMode::StaticClass, TEXT("ABleatchVRGameMode"), &Z_Registration_Info_UClass_ABleatchVRGameMode, CONSTRUCT_RELOAD_VERSION_INFO(FClassReloadVersionInfo, sizeof(ABleatchVRGameMode), 2553722682U) },
	};
}; // Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRGameMode_h__Script_BleatchVR_Statics 
static FRegisterCompiledInInfo Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRGameMode_h__Script_BleatchVR_3493979311{
	TEXT("/Script/BleatchVR"),
	Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRGameMode_h__Script_BleatchVR_Statics::ClassInfo, UE_ARRAY_COUNT(Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRGameMode_h__Script_BleatchVR_Statics::ClassInfo),
	nullptr, 0,
	nullptr, 0,
};
// ********** End Registration *********************************************************************

PRAGMA_ENABLE_DEPRECATION_WARNINGS
