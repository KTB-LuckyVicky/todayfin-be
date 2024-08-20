pipeline {
    agent any

    environment {
        REPO = 'KTB-LuckyVicky/todayfin-be'
        ECR_REPO = '851725447172.dkr.ecr.ap-northeast-2.amazonaws.com/todayfin'
        ECR_CREDENTIALS_ID = 'ecr:ap-northeast-2:ecr_credentials_id'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'dev', url: "https://github.com/${REPO}.git"
            }
        }
        
        stage('Build docker images') {
            steps {
                script {
                    dockerImage = docker.build("${ECR_REPO}:latest")
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                script {
                    docker.withRegistry("https://${ECR_REPO}", "${ECR_CREDENTIALS_ID}") {
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy Docker') {
            steps {
                script {
                    docker.withRegistry("https://${ECR_REPO}", "${ECR_CREDENTIALS_ID}") {
                        
                        sh "docker rm -f todayfin-be || true"
                        
                        sh "docker pull ${ECR_REPO}:latest"
                        
                        sh """
                        docker run -d -p 5000:5000 \
                            -e MARIADB_HOST=${MARIADB_HOST} \
                            -e MARIADB_PASSWORD=${MARIADB_PASSWORD} \
                            -e MARIADB_USER=${MARIADB_USER} \
                            -e MARIADB_PORT=${MARIADB_PORT} \
                            -e MARIADB_DATABASE=${MARIADB_DATABASE} \
                            -e DB_NAME=${DB_NAME} \
                            -e DB_URI='${DB_URI}' \
                            --name todayfin-be \
                            ${ECR_REPO}:latest
                        """
                    }
                }
            }
        }
        
        stage('Check Application Health') {
            steps {
                script {
                    sleep 10
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/", returnStdout: true).trim()
                    if (response != '200') {
                        error("Application health check failed with response code: ${response}")
                    } else {
                        echo "Application is healthy with response code: ${response}"
                    }
                }
            }
        }
    }
}
