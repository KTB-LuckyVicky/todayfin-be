pipeline {
    agent any

    environment {
        REPO = 'KTB-LuckyVicky/todayfin-be'
        ECR_REPO = '851725447172.dkr.ecr.ap-northeast-2.amazonaws.com/todayfin'
        ECR_CREDENTIALS_ID = 'ecr:ap-northeast-2:ecr_credentials_id'
    }

    stages {
        stage('Set Versions') {
            steps {
                script {
                    def currentVersion = sh(script: "grep -o 'app_\\(green\\|blue\\)' /etc/nginx/nginx.conf | tail -n 1 | sed 's/app_//'", returnStdout: true).trim()
                    CURRENT_VERSION = currentVersion ? currentVersion : "blue" // Default to blue if not found
                    NEW_VERSION = CURRENT_VERSION == "green" ? "blue" : "green"
                    NEW_PORT = NEW_VERSION == "green" ? "5000" : "5001"
        
                    env.CURRENT_VERSION = CURRENT_VERSION
                    env.NEW_VERSION = NEW_VERSION
                    env.NEW_PORT = NEW_PORT
        
                    sh """
                    echo "CURRENT_VERSION=${env.CURRENT_VERSION}"
                    echo "NEW_VERSION=${env.NEW_VERSION}"
                    """
                }
            }
        }
        
        stage('Checkout') {
            steps {
                git branch: 'dev', url: "https://github.com/${REPO}.git"
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
                        dockerImage.push(env.NEW_VERSION)
                    }
                }
            }
        }

        stage('Deploy Docker') {
            steps {
                script {
                    docker.withRegistry("https://${ECR_REPO}", "${ECR_CREDENTIALS_ID}") {
                        
                        sh "docker rm -f todayfin-be-${env.NEW_VERSION} || true"
                        
                        sh "docker pull ${ECR_REPO}:${env.NEW_VERSION}"
                        
                        sh """
                        docker run -d -p ${env.NEW_PORT}:5000 \
                            -e MARIADB_HOST=${MARIADB_HOST} \
                            -e MARIADB_PASSWORD=${MARIADB_PASSWORD} \
                            -e MARIADB_USER=${MARIADB_USER} \
                            -e MARIADB_PORT=${MARIADB_PORT} \
                            -e MARIADB_DATABASE=${MARIADB_DATABASE} \
                            -e DB_NAME=${DB_NAME} \
                            -e DB_URI='${DB_URI}' \
                            --name todayfin-be-${env.NEW_VERSION} \
                            ${ECR_REPO}:${env.NEW_VERSION}
                        """
                    }
                }
            }
        }
        
        stage('Update Nginx') {
            steps {
                script {
                    sh """
                    sudo sed -i 's|proxy_pass http://app_${env.CURRENT_VERSION};|proxy_pass http://app_${env.NEW_VERSION};|' /etc/nginx/nginx.conf
                    sudo systemctl reload nginx
                    """
                }
            }
        }
        
        stage('Check Application Health') {
            steps {
                script {
                    sleep 10
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:${env.NEW_PORT}/user/healthcheck", returnStdout: true).trim()
                    if (response != '200') {
                        error("Application health check failed with response code: ${response}")
                    } else {
                        echo "Application is healthy with response code: ${response}"
                    }
                }
            }
        }
      stage('Shutdown Old Version') {  // New stage for shutting down the old version
            steps {
                script {
                    sh """
                    docker rm -f todayfin-be-${env.CURRENT_VERSION} || true
                    """
                }
            }
        }
    }
}
