# Notas de Deployment - tienda.esix.online

## Problema: Secciones de marcas (XAG, Autel, FIMI) no aparecen en producción

### Fecha: 2026-01-06

### Síntomas
- Las secciones de productos por marca funcionan en local pero no en producción
- La API devuelve error 500
- El panel de debug muestra "XAG response: 500", "Autel response: 500", "FIMI response: 500"

### Causa raíz
1. **Ruta incorrecta del servidor**: Passenger usa `/var/www/vhosts/imegamobile.com/tienda.esix.online/` NO `/var/www/vhosts/esix.online/tienda.esix.online/`

2. **Turbopack genera referencias hasheadas**: El build con Turbopack (Next.js 16+) crea referencias como:
   - `@prisma/client-2e7612f24f35ffe7`
   - `@libsql/client-264ded5165d28671`

   Estas referencias no existen en node_modules y causan error 500.

### Solución

#### 1. Subir archivos a la ruta CORRECTA:
```bash
scp archivo.tar.gz root@188.137.65.235:/var/www/vhosts/imegamobile.com/tienda.esix.online/
```

#### 2. Regenerar Prisma en el servidor (Linux):
```bash
cd /var/www/vhosts/imegamobile.com/tienda.esix.online
npx prisma generate
```

#### 3. Crear symlinks para las referencias hasheadas de Turbopack:
```bash
# Prisma client
cd /var/www/vhosts/imegamobile.com/tienda.esix.online/node_modules/@prisma
ln -sf client client-2e7612f24f35ffe7

# LibSQL client
cd /var/www/vhosts/imegamobile.com/tienda.esix.online/node_modules/@libsql
ln -sf client client-264ded5165d28671
```

#### 4. Reiniciar Passenger:
```bash
# Matar proceso actual
ps aux | grep -E 'Passenger.*tienda' | grep -v grep | awk '{print $2}' | xargs -r kill -9

# Trigger restart
touch /var/www/vhosts/imegamobile.com/tienda.esix.online/tmp/restart.txt
```

### Verificación
```bash
# Probar API
curl -sk "https://tienda.esix.online/api/products?brand=xag&limit=1"

# Debe devolver JSON con productos, NO "Internal Server Error"
```

### Notas importantes
- Los hashes (`2e7612f24f35ffe7`, `264ded5165d28671`) pueden cambiar en nuevos builds
- Si cambian, buscar los nuevos hashes con:
  ```bash
  grep -oE '@prisma/client-[a-f0-9]+|@libsql/client-[a-f0-9]+' .next/server/chunks/*.js
  ```
- Siempre verificar que Passenger esté usando la ruta correcta:
  ```bash
  ps aux | grep -E 'Passenger.*tienda'
  ```

### Credenciales servidor
- Host: 188.137.65.235
- User: root
- Pass: FisherYou1983
