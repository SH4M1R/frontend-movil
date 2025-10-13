YOURBRAND - MODASTYLE

Aplicación móvil de ventas desarrollada con Expo, React Native y TypeScript. Permite registro, inicio de sesión, perfil de usuario y manejo de un carrito de compras.
Características principales
- Autenticación de usuarios
Registro de nuevos usuarios.
Inicio de sesión con email o nombre de usuario.
Cierre de sesión.
- Perfil de usuario
Visualización del nombre y avatar del usuario.
Opciones principales: Mi Perfil, Mis Pedidos, Mis Favoritos.
Opciones secundarias: Mis Direcciones, Términos y Condiciones, Atención al Cliente, Libro de Reclamaciones.
- Carrito de compras
Ícono de carrito en el header con contador de productos.
Indicador siempre visible, aunque no haya productos.
- Diseño moderno y responsive
Gradientes y animaciones con LinearGradient y react-native-reanimated.
Componentes reutilizables para inputs y botones.
- Persistencia simulada
Usuarios almacenados en un archivo usuarios.ts para pruebas locales.
Uso de Context API (AuthContext) para manejar estado global de autenticación.
Tecnologías utilizadas
- React Native
- Expo
- TypeScript
- React Navigation
- react-native-reanimated
- Expo Router

Instalación y ejecución

1. Clonar el repositorio:
git clone https://github.com/tu-usuario/yourbrand-modastyle.git
cd frontend-movil

2. Instalar dependencias:
npm install

3. Iniciar el proyecto con Expo:
npx expo start

4. Abrir la aplicación en un emulador o dispositivo físico mediante QR Code.