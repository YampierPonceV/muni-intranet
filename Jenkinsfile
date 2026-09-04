pipeline {
    agent any

    stages {
        stage('1. Checkout Código') {
            steps {
                checkout scm
            }
        }

        stage('2. Instalar Dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('3. Ejecutar Pruebas Automáticas') {
            steps {
                sh 'npm test'
            }
        }

        stage('4. Despliegue con Ansible') {
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
            echo '¡Despliegue completado con éxito en Intranet Municipal!'
        }
        failure {
            echo 'Pruebas fallidas. Se cancela el despliegue a producción.'
        }
    }
}
