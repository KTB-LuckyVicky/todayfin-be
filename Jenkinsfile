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
                    def currentVersion = sh(script: "grep -o 'server.*500[0-1]' /etc/nginx/conf.d/upstream.conf | grep -o '500[0-1]' | tail -n 1", returnStdout: true).trim()
                    CURRENT_VERSION = currentVersion == "5000" ? "green" : "blue"
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
                    sudo sed -i 's|server 43.201.82.230:${env.CURRENT_PORT};|server 43.201.82.230:${env.NEW_PORT};|' /etc/nginx/conf.d/upstream.conf
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
      stage('Shutdown Old Version') {
            steps {
                script {
                    sh """
                    docker rm -f todayfin-be-${env.CURRENT_VERSION} || true
                    docker image prune -f
                    """
                }
            }
        }
    }
}
