// Copyright Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

#include "UObject/GeneratedCppIncludes.h"
#include "BleatchVRCameraManager.h"

PRAGMA_DISABLE_DEPRECATION_WARNINGS
static_assert(!UE_WITH_CONSTINIT_UOBJECT, "This generated code can only be compiled with !UE_WITH_CONSTINIT_OBJECT");
void EmptyLinkFunctionForGeneratedCodeBleatchVRCameraManager() {}

// ********** Begin Cross Module References ********************************************************
BLEATCHVR_API UClass* Z_Construct_UClass_ABleatchVRCameraManager();
BLEATCHVR_API UClass* Z_Construct_UClass_ABleatchVRCameraManager_NoRegister();
ENGINE_API UClass* Z_Construct_UClass_APlayerCameraManager();
UPackage* Z_Construct_UPackage__Script_BleatchVR();
// ********** End Cross Module References **********************************************************

// ********** Begin Class ABleatchVRCameraManager **************************************************
FClassRegistrationInfo Z_Registration_Info_UClass_ABleatchVRCameraManager;
UClass* ABleatchVRCameraManager::GetPrivateStaticClass()
{
	using TClass = ABleatchVRCameraManager;
	if (!Z_Registration_Info_UClass_ABleatchVRCameraManager.InnerSingleton)
	{
		GetPrivateStaticClassBody(
			TClass::StaticPackage(),
			TEXT("BleatchVRCameraManager"),
			Z_Registration_Info_UClass_ABleatchVRCameraManager.InnerSingleton,
			StaticRegisterNativesABleatchVRCameraManager,
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
	return Z_Registration_Info_UClass_ABleatchVRCameraManager.InnerSingleton;
}
UClass* Z_Construct_UClass_ABleatchVRCameraManager_NoRegister()
{
	return ABleatchVRCameraManager::GetPrivateStaticClass();
}
struct Z_Construct_UClass_ABleatchVRCameraManager_Statics
{
#if WITH_METADATA
	static constexpr UECodeGen_Private::FMetaDataPairParam Class_MetaDataParams[] = {
#if !UE_BUILD_SHIPPING
		{ "Comment", "/**\n *  Basic First Person camera manager.\n *  Limits min/max look pitch.\n */" },
#endif
		{ "IncludePath", "BleatchVRCameraManager.h" },
		{ "ModuleRelativePath", "BleatchVRCameraManager.h" },
#if !UE_BUILD_SHIPPING
		{ "ToolTip", "Basic First Person camera manager.\nLimits min/max look pitch." },
#endif
	};
#endif // WITH_METADATA

// ********** Begin Class ABleatchVRCameraManager constinit property declarations ******************
// ********** End Class ABleatchVRCameraManager constinit property declarations ********************
	static UObject* (*const DependentSingletons[])();
	static constexpr FCppClassTypeInfoStatic StaticCppClassTypeInfo = {
		TCppClassTypeTraits<ABleatchVRCameraManager>::IsAbstract,
	};
	static const UECodeGen_Private::FClassParams ClassParams;
}; // struct Z_Construct_UClass_ABleatchVRCameraManager_Statics
UObject* (*const Z_Construct_UClass_ABleatchVRCameraManager_Statics::DependentSingletons[])() = {
	(UObject* (*)())Z_Construct_UClass_APlayerCameraManager,
	(UObject* (*)())Z_Construct_UPackage__Script_BleatchVR,
};
static_assert(UE_ARRAY_COUNT(Z_Construct_UClass_ABleatchVRCameraManager_Statics::DependentSingletons) < 16);
const UECodeGen_Private::FClassParams Z_Construct_UClass_ABleatchVRCameraManager_Statics::ClassParams = {
	&ABleatchVRCameraManager::StaticClass,
	"Engine",
	&StaticCppClassTypeInfo,
	DependentSingletons,
	nullptr,
	nullptr,
	nullptr,
	UE_ARRAY_COUNT(DependentSingletons),
	0,
	0,
	0,
	0x008002ACu,
	METADATA_PARAMS(UE_ARRAY_COUNT(Z_Construct_UClass_ABleatchVRCameraManager_Statics::Class_MetaDataParams), Z_Construct_UClass_ABleatchVRCameraManager_Statics::Class_MetaDataParams)
};
void ABleatchVRCameraManager::StaticRegisterNativesABleatchVRCameraManager()
{
}
UClass* Z_Construct_UClass_ABleatchVRCameraManager()
{
	if (!Z_Registration_Info_UClass_ABleatchVRCameraManager.OuterSingleton)
	{
		UECodeGen_Private::ConstructUClass(Z_Registration_Info_UClass_ABleatchVRCameraManager.OuterSingleton, Z_Construct_UClass_ABleatchVRCameraManager_Statics::ClassParams);
	}
	return Z_Registration_Info_UClass_ABleatchVRCameraManager.OuterSingleton;
}
DEFINE_VTABLE_PTR_HELPER_CTOR_NS(, ABleatchVRCameraManager);
ABleatchVRCameraManager::~ABleatchVRCameraManager() {}
// ********** End Class ABleatchVRCameraManager ****************************************************

// ********** Begin Registration *******************************************************************
struct Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCameraManager_h__Script_BleatchVR_Statics
{
	static constexpr FClassRegisterCompiledInInfo ClassInfo[] = {
		{ Z_Construct_UClass_ABleatchVRCameraManager, ABleatchVRCameraManager::StaticClass, TEXT("ABleatchVRCameraManager"), &Z_Registration_Info_UClass_ABleatchVRCameraManager, CONSTRUCT_RELOAD_VERSION_INFO(FClassReloadVersionInfo, sizeof(ABleatchVRCameraManager), 1322592150U) },
	};
}; // Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCameraManager_h__Script_BleatchVR_Statics 
static FRegisterCompiledInInfo Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCameraManager_h__Script_BleatchVR_2314239608{
	TEXT("/Script/BleatchVR"),
	Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCameraManager_h__Script_BleatchVR_Statics::ClassInfo, UE_ARRAY_COUNT(Z_CompiledInDeferFile_FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCameraManager_h__Script_BleatchVR_Statics::ClassInfo),
	nullptr, 0,
	nullptr, 0,
};
// ********** End Registration *********************************************************************

PRAGMA_ENABLE_DEPRECATION_WARNINGS
