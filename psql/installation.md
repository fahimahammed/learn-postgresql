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

---