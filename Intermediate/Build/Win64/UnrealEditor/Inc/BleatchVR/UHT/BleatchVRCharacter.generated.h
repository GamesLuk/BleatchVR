// Copyright Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

// IWYU pragma: private, include "BleatchVRCharacter.h"

#ifdef BLEATCHVR_BleatchVRCharacter_generated_h
#error "BleatchVRCharacter.generated.h already included, missing '#pragma once' in BleatchVRCharacter.h"
#endif
#define BLEATCHVR_BleatchVRCharacter_generated_h

#include "UObject/ObjectMacros.h"
#include "UObject/ScriptMacros.h"

PRAGMA_DISABLE_DEPRECATION_WARNINGS

// ********** Begin Class ABleatchVRCharacter ******************************************************
#define FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h_24_RPC_WRAPPERS_NO_PURE_DECLS \
	DECLARE_FUNCTION(execDoJumpEnd); \
	DECLARE_FUNCTION(execDoJumpStart); \
	DECLARE_FUNCTION(execDoMove); \
	DECLARE_FUNCTION(execDoAim);


struct Z_Construct_UClass_ABleatchVRCharacter_Statics;
BLEATCHVR_API UClass* Z_Construct_UClass_ABleatchVRCharacter_NoRegister();

#define FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h_24_INCLASS_NO_PURE_DECLS \
private: \
	static void StaticRegisterNativesABleatchVRCharacter(); \
	friend struct ::Z_Construct_UClass_ABleatchVRCharacter_Statics; \
	static UClass* GetPrivateStaticClass(); \
	friend BLEATCHVR_API UClass* ::Z_Construct_UClass_ABleatchVRCharacter_NoRegister(); \
public: \
	DECLARE_CLASS2(ABleatchVRCharacter, ACharacter, COMPILED_IN_FLAGS(CLASS_Abstract | CLASS_Config), CASTCLASS_None, TEXT("/Script/BleatchVR"), Z_Construct_UClass_ABleatchVRCharacter_NoRegister) \
	DECLARE_SERIALIZER(ABleatchVRCharacter)


#define FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h_24_ENHANCED_CONSTRUCTORS \
	/** Deleted move- and copy-constructors, should never be used */ \
	ABleatchVRCharacter(ABleatchVRCharacter&&) = delete; \
	ABleatchVRCharacter(const ABleatchVRCharacter&) = delete; \
	DECLARE_VTABLE_PTR_HELPER_CTOR(NO_API, ABleatchVRCharacter); \
	DEFINE_VTABLE_PTR_HELPER_CTOR_CALLER(ABleatchVRCharacter); \
	DEFINE_ABSTRACT_DEFAULT_CONSTRUCTOR_CALL(ABleatchVRCharacter) \
	NO_API virtual ~ABleatchVRCharacter();


#define FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h_21_PROLOG
#define FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h_24_GENERATED_BODY \
PRAGMA_DISABLE_DEPRECATION_WARNINGS \
public: \
	FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h_24_RPC_WRAPPERS_NO_PURE_DECLS \
	FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h_24_INCLASS_NO_PURE_DECLS \
	FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h_24_ENHANCED_CONSTRUCTORS \
private: \
PRAGMA_ENABLE_DEPRECATION_WARNINGS


class ABleatchVRCharacter;

// ********** End Class ABleatchVRCharacter ********************************************************

#undef CURRENT_FILE_ID
#define CURRENT_FILE_ID FID_Users_lukas_Documents_UnrealProjects_BleatchVR_Source_BleatchVR_BleatchVRCharacter_h

PRAGMA_ENABLE_DEPRECATION_WARNINGS
