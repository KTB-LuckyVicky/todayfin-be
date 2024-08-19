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
                            -e DB_URI='${DB_URI}' \
                            -e DB_NAME=${DB_NAME} \
                            --name todayfin-be \
                            ${ECR_REPO}:latest
                        """
                    }
                }
            }
        }
    }
}