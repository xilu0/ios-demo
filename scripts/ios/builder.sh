#!/bin/bash

  set -e
  cur_dir=`dirname $0`

  BUILD_NAME=3.0-release
  BUILD_NUMBER=3
  IOS_APP_ID=com.aixiangdao.ios
  IOS_CERTIFICATE=p12
  IOS_CERTIFICATE_KEY=aixiangdao@88
  IOS_PROVISION_PROFILE=AdHoc_com.Wangushengshi.axd.mobileprovision
  IOS_EXPORT_OPTIONS_PLIST=Info.plist -exportPath
  IOS_SCHEME=AixiangdaoDemo
  IOS_CONFIGURATION=ad-hoc
  PROJECT_NAME=AixiangdaoDemo
  workspace_NAME=AixiangdaoDemo

  WORKING_DIR=`pwd`;
  cd $cur_dir/../../ios
  echo "Setting version to ${BUILD_NUMBER}, ${BUILD_NAME}"
  xcrun agvtool new-version -all ${BUILD_NUMBER}
  xcrun agvtool new-marketing-version ${BUILD_NAME}
  cd $WORKING_DIR

  echo "Archiving the project"
  mkdir -p $cur_dir/../../ios/build
  xcodebuild archive -workspace $cur_dir/../../ios/AixiangdaoDemo.xcworkspace  -scheme $IOS_SCHEME -configuration $IOS_CONFIGURATION -derivedDataPath $cur_dir/../../ios/build -archivePath $cur_dir/../../ios/build/${PROJECT_NAME}.xcarchive

  # or if you are not using xcodeproj and are using xcworkspace to build.. use the below code:

  # echo "Archiving the project"
  # xcodebuild clean archive PRODUCT_BUNDLE_IDENTIFIER=${IOS_APP_ID} -workspace $cur_dir/../../ios/${PROJECT_NAME}.xcworkspace -scheme $IOS_SCHEME -configuration $IOS_CONFIGURATION -derivedDataPath $cur_dir/../../ios/build -archivePath $cur_dir/../../ios/build/Products/${PROJECT_NAME}.xcarchive

  #SIGN
  # Issue : "No applicable devices found."
  # Fix: https://stackoverflow.com/questions/39634404/xcodebuild-exportarchive-no-applicable-devices-found
  D:\aixiangdao\axd-app\ios\AixiangdaoDemo\Info.plist
  unset GEM_HOME
  unset GEM_PATH

  echo "Export archive to create IPA file using $IOS_EXPORT_OPTIONS_PLIST"
  xcodebuild -exportArchive -archivePath $cur_dir/../../ios/build/${PROJECT_NAME}.xcarchive -exportOptionsPlist $cur_dir/../../scripts/ios/AixiangdaoDemo/Info.plist -exportPath $cur_dir/../../ios/build/Products/IPA

  echo "IPA will be found at $cur_dir/../../ios/build/Products/IPA/$IOS_SCHEME.ipa"
  ls -l $cur_dir/../../ios/build/Products/IPA/

  echo "REMOVING SENSITIVE FILES"
  #Making the login keychain as the default-keychain
  security default-keychain -s login.keychain
  security delete-keychain ios-build.keychain
  rm ~/Library/MobileDevice/Provisioning\ Profiles/$IOS_PROVISION_PROFILE
