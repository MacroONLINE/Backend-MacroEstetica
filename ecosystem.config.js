// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: 'macro-backend',
        cwd: '/root/backend',              // <-- ajusta si tu backend está en otra ruta
        script: 'dist/main.js',            // o 'dist/src/main.js' según tu build
        instances: 1,
        exec_mode: 'fork',
        autorestart: true,
        watch: false,
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'production',
          PORT: '3010',
  
          // App
          APP_URL: 'https://macroestetica.com/api-backend',
  
          // JWT
          JWT_SECRET: 'J747N9i7PPjsTkXYeZWVywI933WCZ+T43EdHntfnsuU=',
          JWT_EXPIRATION: '30d',
  
          // DB
          DATABASE_URL: 'postgresql://amcroestetica_dbusr:G7x!U2p$K9qR5vnZ@127.0.0.1:5432/macro_db?schema=public',
          SHADOW_DATABASE_URL: 'postgresql://amcroestetica_dbusr:G7x!U2p$K9qR5vnZ@127.0.0.1:5432/macro_db_shadow',
  
          // Cloudinary
          CLOUDINARY_CLOUD_NAME: 'dwcrzwawj',
          CLOUDINARY_API_KEY: '336531311612847',
          CLOUDINARY_API_SECRET: 'IYc67eU8jW2qSb5q-MRi7wNfKrs',
  
          // ===========================
          // STRIPE - TEST MODE (ACTIVO)
          // ===========================
          // ⚠️ Reemplaza con tu publishable key de TEST:
          STRIPE_SECRET_KEY: sk_test_51QP74lGpVwhT9fv0sY8XdH6OpVAfuSLdGaVMUqvt1PNAecGV1eBhod9VG5afFDeJO96B5Q5f8GYIIV2F9dZd5hYp00vVeroU4n,
          STRIPE_WEBHOOK_SECRET:whsec_6W5UG3Adau1bUdNXlEsp3lqVjfSSKidj,
          // ===========================
          // STRIPE - LIVE (COMENTADO)
          // ===========================
          // STRIPE_PUBLISHABLE_KEY: 'pk_live_51QP74lGpVwhT9fv0DsSqKsdVCy5bJ0 cPd4vomuXUEZvvTjVHjGRbzWlawAFIDsUA51vdhK32ZhSwzIuNYJwTE7D900fJaC9O4J',
          // STRIPE_SECRET_KEY: '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',
          // STRIPE_WEBHOOK_SECRET: 'whsec_live_REEMPLAZA_SI_USAS_PROD',
  
          // Agora
          AGORA_APP_ID: '30eeedb05a31430eac4d19dbe1b73ab7',
          AGORA_APP_CERTIFICATE: '31724ea95d98465baa793ed09a3c68f5',
          AGORA_CHAT_ORG_NAME: '411307294',
          AGORA_CHAT_APP_NAME: '1506986',
          AGORA_CHAT_CLIENT_ID: '8d6c4278b1464eacbefefee97a9b4ea8',
          AGORA_CHAT_CLIENT_SECRET: '4839961f740b4a7c8c622fa6e51de897',
          AGORA_CHAT_API_BASE_URL: 'https://a41.chat.agora.io',
  
          // SMTP
          SMTP_HOST: 'smtp-relay.brevo.com',
          SMTP_PORT: '2525',
          SMTP_SECURE: 'false',
          SMTP_USER: '77d1ba001@smtp-brevo.com',
          SMTP_PASS: 'xTbBftkj6Xh2AJNL',
          SMTP_FROM: 'joaquin.elia@hotmail.com',
          SMTP_NAME: 'Macroestética',
          SMTP_REPLY_TO: 'joaquin.elia@hotmail.com',
  
          // Flags
          ALLOW_ANY_PASSWORD: 'true',
        },
  
        // (Opcional) logs dedicados
        // out_file: '/root/backend/pm2-out.log',
        // error_file: '/root/backend/pm2-err.log',
        // log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      },
    ],
  };
  