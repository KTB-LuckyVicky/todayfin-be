pipeline {
    agent any

    environment {
        REPO = 'KTB-LuckyVicky/todayfin-be'
        ECR_REPO = '851725447172.dkr.ecr.ap-northeast-2.amazonaws.com/todayfinpractice'
        ECR_CREDENTIALS_ID = 'ecr:ap-northeast-2:ecr_credentials_id'
        CURRENT_VERSION = "blue" // 현재 활성화된 버전 (green 또는 blue)
        NEW_VERSION = CURRENT_VERSION == "green" ? "blue" : "green"
        NEW_PORT = NEW_VERSION == "green" ? "5000" : "5001"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feat/jenkins-greenblue', url: "https://github.com/${REPO}.git"
            }
        }
        
        stage('Build docker images') {
            steps {
                script {
                    dockerImage = docker.build("${ECR_REPO}:${NEW_VERSION}")
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                script {
                    docker.withRegistry("https://${ECR_REPO}", "${ECR_CREDENTIALS_ID}") {
                        dockerImage.push(NEW_VERSION)
                    }
                }
            }
        }

        stage('Deploy Docker') {
            steps {
                script {
                    docker.withRegistry("https://${ECR_REPO}", "${ECR_CREDENTIALS_ID}") {
                        
                        sh "docker rm -f todayfin-be-${NEW_VERSION} || true"
                        
                        sh "docker pull ${ECR_REPO}:${NEW_VERSION}"
                        
                        sh """
                        docker run -d -p ${NEW_PORT}:5000 \
                            -e MARIADB_HOST=${MARIADB_HOST} \
                            -e MARIADB_PASSWORD=${MARIADB_PASSWORD} \
                            -e MARIADB_USER=${MARIADB_USER} \
                            -e MARIADB_PORT=${MARIADB_PORT} \
                            -e MARIADB_DATABASE=${MARIADB_DATABASE} \
                            -e DB_NAME=${DB_NAME} \
                            -e DB_URI='${DB_URI}' \
                            --name todayfin-be-${NEW_VERSION} \
                            ${ECR_REPO}:${NEW_VERSION}
                        """
                    }
                }
            }
        }
        
        stage('Update Nginx') {
            steps {
                script {
                    sh """
                    sudo sed -i 's/proxy_pass http:\\/\\/app_${CURRENT_VERSION};/proxy_pass http:\\/\\/app_${NEW_VERSION};/' /etc/nginx/nginx.conf
                    sudo systemctl reload nginx
                    """
                }
            }
        }
        
        stage('Check Application Health') {
            steps {
                script {
                    sleep 5
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:${NEW_PORT}/user/healthcheck ", returnStdout: true).trim()
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
