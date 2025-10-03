## Installation

### Windows

1. Download the PostgreSQL installer for Windows from the official PostgreSQL website: [Download Link](https://www.postgresql.org/download/windows/)

2. Run the downloaded installer.

3. Follow the installation wizard instructions and select the components you want to install. Make note of the port number and password you set during the installation.

### macOS

1. You have multiple options for installing PostgreSQL on macOS:

   - Homebrew: Open Terminal and run the command `brew install postgresql`.
   - Postgres.app: Download and install the Postgres.app from [Postgres.app](https://postgresapp.com/).
   - PostgreSQL official distribution: Download the macOS installer from [Download Link](https://www.postgresql.org/download/macosx/) and run it.

2. Follow the installation instructions provided by the chosen method.

### Linux

1. Update the package list on your system by running the following command:

   - For Ubuntu/Debian:
     ```
     sudo apt update
     ```

   - For CentOS/Fedora:
     ```
     sudo dnf update
     ```

2. Install PostgreSQL using the package manager:

   - For Ubuntu/Debian:
     ```
     sudo apt install postgresql
     ```

   - For CentOS/Fedora:
     ```
     sudo dnf install postgresql
     ```

3. Once the installation is complete, PostgreSQL should be up and running. Refer to the documentation for your specific Linux distribution on how to start or enable the PostgreSQL service.

4. Optionally, you can secure your PostgreSQL installation by setting a password for the database superuser account (`postgres`).

### Docker 

1. The prerequsite for this is installation of the docker containerzation tool docker 

2. Check the version of the docker tool
   ```
      docker --version 
   ```

3. Pull the offical postgreSql image
   ```
      docker pull postgres
   ```

4. Start a postgresSql container
    ```
      docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
    ```
     - Replace the `mysecretpassword` with your desired password
     - This starts a container named my-postgres in the background

5. Enter the postgresSql shell inside the container(only while running)
    ```
      docker exec -it my-postgres psql -U postgres
    ```
    - This opens the interative psql shell as the postgres user

6.  To stop and remove the container when done
    ```
      docker stop my-postgres
      docker rm my-postgres
    ```

---