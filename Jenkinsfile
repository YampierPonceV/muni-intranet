pipeline {
    agent none

    stages {
        stage('1. Checkout Código') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('2. Instalar y Probar') {
            agent {
                docker { image 'node:18-alpine' }
            }
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('3. Despliegue con Ansible') {
            agent any
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
            echo '¡Despliegue completado con éxito en la Intranet Municipal!'
        }
        failure {
            echo 'CRÍTICO: El pipeline falló en alguna etapa. Se aborta el despliegue a producción.'
        }
        always {
            cleanWs()
        }
    }
}
