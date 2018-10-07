#!/bin/bash

  set -e
  cur_dir=`dirname $0`
  BUILD_NAME=3.0-release
  BUILD_NUMBER=1
  IOS_APP_ID=com.aixiangdao.ios
  IOS_CERTIFICATE=GWV8Z3YYAN.p12
  IOS_CERTIFICATE_KEY=aixiangdao@88
  IOS_PROVISION_PROFILE=AdHoc_com.Wangushengshi.axd.mobileprovision
  IOS_EXPORT_OPTIONS_PLIST=
  IOS_SCHEME=AixiangdaoDemo
  IOS_CONFIGURATION=release
  PROJECT_NAME=AixiangdaoDemo

  #Check if ios-build keychain exists
  export keychainCount=`security list-keychains | grep -E 'ios-build' -c`

  if [ $keychainCount == 0 ] ; then
    echo "Create ios-build keychain"
    # Create a custom keychain
    security create-keychain -p "ios-build-password" ios-build.keychain
  fi
  # Add it to the list
  security list-keychains -d user -s ios-build.keychain

  echo "Making the ios-build keychain default ,so xcodebuild will use it for signing"
  security default-keychain -s ios-build.keychain

  echo "Unlocking the ios-build keychain"
  security unlock-keychain -p "ios-build-password" ios-build.keychain

  # Set keychain timeout to 1 hour for long builds
  # see http://www.egeek.me/2013/02/23/jenkins-and-xcode-user-interaction-is-not-allowed/
  security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

  echo "Importing $IOS_CERTIFICATE to keychain"
  security import $cur_dir/certs/$IOS_CERTIFICATE -k ~/Library/Keychains/ios-build.keychain -P "ios-build-password" -T "/usr/bin/codesign" -A

  #Mac OS Sierra https://stackoverflow.com/questions/39868578/security-codesign-in-sierra-keychain-ignores-access-control-settings-and-ui-p
  security set-key-partition-list -S apple-tool:,apple: -s -k "ios-build-password" ios-build.keychain

  # Put the provisioning profile in place
  echo "Coping $IOS_PROVISION_PROFILE in place"
  mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
  cp "$cur_dir/profile/$IOS_PROVISION_PROFILE" ~/Library/MobileDevice/Provisioning\ Profiles/
