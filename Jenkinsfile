pipeline {
    agent {
        docker {
            image 'node:8' 
            args '-p 8091:8091' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }
    }
}