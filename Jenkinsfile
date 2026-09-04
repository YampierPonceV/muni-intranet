pipeline {
    agent any

    stages {
        stage('1. Checkout Código') {
            steps {
                checkout scm
            }
        }

        stage('2. Probar Código Localmente') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('3. Desplegar en Producción (LXC 103)') {
            steps {
                sh '''
                echo "[intranet_servers]\n192.168.20.10 ansible_user=root" > inventory.ini
                ansible-playbook -i inventory.ini deploy.yml
                '''
            }
        }
    }

    post {
        success {
            echo '¡Código actualizado y PM2 reiniciado con éxito en la Intranet!'
        }
        failure {
            echo 'ERROR: Las pruebas fallaron o el despliegue no pudo completarse.'
        }
    }
}
