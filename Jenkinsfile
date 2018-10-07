pipeline {
    agent {
        label 'android'
      }
    // environment {
    //     def commitID = sh "$(git rev-parse HEAD)"
    // }
    stages {
        stage('preEmail') { 
            steps {
                emailext(
                to: 'wangyj@wangushengshi.com,chenyx@wangushengshi.com,lishf@wangushengshi.com,zengzs@wangushengshi.com,ningxw@wangushengshi.com',
                subject: '''请注意！！axd-app分支${BRANCH_NAME} android开始打包''',
                body: '''axd-app分支${BRANCH_NAME}开始打包，测试请等待部署更新，开发提交者请关注任务
                提交ID：${env.GIT_COMMIT}
                提交人：${env.GIT_COMMITTER_NAME}
                任务地址：${BUILD_URL}
                下载地址：https://www.pgyer.com/yPIu''', 
                recipientProviders: [brokenBuildSuspects()],
                )              
            }
        }
        stage('package') {
          steps {
            sh 'env'
            sh "npm config set registry https://registry.npm.taobao.org;npm install -g react-native-cli;npm install;react-native link;cd android && ./gradlew assemblerelease"
          }
        }
        stage('upload') {
            steps {
              sh "curl -F 'file=@android/app/build/outputs/apk/app-release.apk' -F 'uKey=9d270f0cd9408589e281dbfe30513f87' -F '_api_key=13dbf0cb1ab283314618721c28240d9c' https://qiniu-storage.pgyer.com/apiv1/app/upload"
            }
        }
      }
    post {
        failure {
            emailext(
                to: 'wangyj@wangushengshi.com,chenyx@wangushengshi.com,lishf@wangushengshi.com,zengzs@wangushengshi.com,ningxw@wangushengshi.com',
                subject: '''axd-app分支${BRANCH_NAME} Android自动打包失败''',
                body: '''axd-app ${BRANCH_NAME}分支android打包失败，请速处理，附件是任务日志，
                任务地址：${BUILD_URL}
                ''', 
                recipientProviders: [brokenBuildSuspects()],
                attachLog: true,
            )             
        }
        success {
            emailext(
                to: 'wangyj@wangushengshi.com,chenyx@wangushengshi.com,lishf@wangushengshi.com,zengzs@wangushengshi.com,ningxw@wangushengshi.com',
                subject: '''恭喜，axd-app分支${BRANCH_NAME} android自动打包成功''',
                body: '''分支${BRANCH_NAME}自动部署成功，
                任务地址：${BUILD_URL}， 
                app地址：https://www.pgyer.com/yPIu''', 
                recipientProviders: [brokenBuildSuspects()],
                attachLog: true,
            )
        }
    }
}