#!/usr/bin/env bash
# fail if any commands fails
set -e
set -x
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

SYSTEM=$(uname)
echo $SYSTEM

TARGET_NAME=AixiangdaoDemo
BUILD_TYPE=Release

echo "Hello World!"
ls -l
#xcodebuild -showsdks
which react-native || npm install -g react-native-cli

#npm config set registry https://registry.npm.taobao.org
if yarn install
then
   echo
else 
   fastlane android faildingding
   exit 1
fi
#
if react-native link
then
   echo
else 
   fastlane android faildingding
   exit 1
fi
mv certs/build.gradle node_modules/react-native-linear-gradient/android/build.gradle
mv certs/RCTCapturePackage.java  node_modules/react-native-smart-barcode/android/src/main/java/com/reactnativecomponent/barcode/
mv certs/Barcode.js node_modules/react-native-smart-barcode/
#mkdir -p  ./ios/bundle

############################################
#npm run bundle-ios
#ls ./ios/bundle/
#cp -R ./ios/bundle/* ./ios/AixiangdaoDemo/
#cd ios
#xcodebuild clean -workspace ${TARGET_NAME}.xcworkspace -scheme ${TARGET_NAME} -configuration ${BUILD_TYPE}
#xcodebuild archive -workspace ${TARGET_NAME}.xcworkspace -scheme ${TARGET_NAME} -archivePath ./build
#xcodebuild -exportArchive -archivePath "./build/${TARGET_NAME}.xcarchive" -exportPath ./build/${TARGET_NAME}.ipa -exportOptionsPlist ${EXPORTOPTIONSPLIST}
#######################################################################

#######
if fastlane add_plugin pgyer
then
   echo
else 
   fastlane android faildingding
   exit 1
fi

######
case $SYSTEM in 
    Linux)
          if sed -i '25,28d' node_modules/react-native-yunpeng-alipay/android/src/main/java/com/yunpeng/alipay/AlipayPackage.java
          then
              echo modify AlipayPackage seccess
          else 
              fastlane android faildingding
              exit 1
          fi

          if fastlane android beta
          then
            echo  package seccess
          else 
            fastlane android faildingding
            exit 1
          fi

          #########
          if export apk=$(find android/ -name *.apk)
          then
            echo $apk
          else 
            fastlane android faildingding
            exit 1
          fi

          ######
          if fastlane android uploadpgyer
          then
            echo upload pgyuer seccess
          else 
            fastlane android faildingding
            exit 1
          fi

          ####
          fastlane android senddingding
          ;;
    Darwin)
          if sed -i " " '25,28d' node_modules/react-native-yunpeng-alipay/android/src/main/java/com/yunpeng/alipay/AlipayPackage.java
          then
            echo  modify AlipayPackage seccess
          else 
            fastlane android faildingding
            exit 1
          fi

          if npm run bundle-ios
          then
            ls ./ios/bundle/
            cp -R ./ios/bundle/* ./ios/AixiangdaoDemo/
            export FASTLANE_DONT_STORE_PASSWORD=1
            export FASTLANE_USER=3336406072@qq.com
            export  FASTLANE_PASSWORD=Aixiangdao20170518
            export MATCH_PASSWORD=aixiangdao
            fastlane ios build
          else
            fastlane ios Darwinfail
            exit 1
          fi
          ;;
    *)
          echo "unknow system"
esac
           

# if [[ SYSTEM = "Darwin" ]]
# then
#   echo pinguo
# fi
