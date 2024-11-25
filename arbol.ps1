# Ruta base del proyecto
$baseDir = "C:\Users\Admin\Desktop\El Sistema App\El-Sistema-PC"

# Array de directorios para crear
$directories = @(
    "$baseDir\public",
    "$baseDir\src\assets",
    "$baseDir\src\components\ui",
    "$baseDir\src\components\asistencia\registro",
    "$baseDir\src\components\asistencia\notificaciones",
    "$baseDir\src\components\asistencia\analisis",
    "$baseDir\src\components\asistencia\incentivos",
    "$baseDir\src\components\asistencia\reportes",
    "$baseDir\src\components\insignias",
    "$baseDir\src\repertorio",
    "$baseDir\src\intervencion",
    "$baseDir\src\reportesGlobales",
    "$baseDir\src\analisisPredictivo",
    "$baseDir\layouts",
    "$baseDir\router",
    "$baseDir\services",
    "$baseDir\store",
    "$baseDir\views\asistencia",
    "$baseDir\views\reportes",
    "$baseDir\views\repertorio",
    "$baseDir\views\intervencion",
    "$baseDir\views\reportesGlobales",
    "$baseDir\views\analisisPredictivo"
)

# Crear los directorios si no existen
foreach ($dir in $directories) {
    if (!(Test-Path -Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Output "Creado: $dir"
    } else {
        Write-Output "Ya existe: $dir"
    }
}

# Array de archivos a crear
$files = @(
    "$baseDir\public\index.html",
    "$baseDir\src\components\ui\Button.vue",
    "$baseDir\src\components\ui\Modal.vue",
    "$baseDir\src\components\ui\ProgressBar.vue",
    "$baseDir\src\components\asistencia\registro\RegistroAsistencia.vue",
    "$baseDir\src\components\asistencia\registro\SelectorEstado.vue",
    "$baseDir\src\components\asistencia\notificaciones\NotificacionInasistencia.vue",
    "$baseDir\src\components\asistencia\notificaciones\AlertaRiesgoAbandono.vue",
    "$baseDir\src\components\asistencia\analisis\ResumenAsistencia.vue",
    "$baseDir\src\components\asistencia\analisis\TendenciasMensuales.vue",
    "$baseDir\src\components\asistencia\analisis\ComparativaGrupal.vue",
    "$baseDir\src\components\asistencia\analisis\ImpactoAsistenciaRepertorio.vue",
    "$baseDir\src\components\asistencia\incentivos\InsigniaCompromiso.vue",
    "$baseDir\src\components\asistencia\incentivos\SistemaPuntos.vue",
    "$baseDir\src\components\asistencia\incentivos\MedallaPuntualidad.vue",
    "$baseDir\src\components\asistencia\reportes\ReporteDiario.vue",
    "$baseDir\src\components\asistencia\reportes\ReporteMensual.vue",
    "$baseDir\src\components\asistencia\reportes\ExportarReporte.vue",
    "$baseDir\src\components\insignias\OtorgarInsignia.vue",
    "$baseDir\src\components\insignias\HistorialInsignias.vue",
    "$baseDir\src\components\insignias\InsigniasEspeciales.vue",
    "$baseDir\src\repertorio\ListaRepertorio.vue",
    "$baseDir\src\repertorio\DetalleRepertorio.vue",
    "$baseDir\src\repertorio\RegistroProgresoPasaje.vue",
    "$baseDir\src\repertorio\RecomendacionesPractica.vue",
    "$baseDir\src\intervencion\SeleccionPasajesIntervencion.vue",
    "$baseDir\src\intervencion\RegistroObjetivosEstrategias.vue",
    "$baseDir\src\intervencion\ProgresoIntervencion.vue",
    "$baseDir\src\reportesGlobales\MapaCalorRendimiento.vue",
    "$baseDir\src\reportesGlobales\ComparativaProgresoPeriodo.vue",
    "$baseDir\src\reportesGlobales\IndicadoresCompromisoGlobal.vue",
    "$baseDir\src\analisisPredictivo\AlertaRiesgoAbandono.vue",
    "$baseDir\src\analisisPredictivo\RecomendacionesIntervencion.vue",
    "$baseDir\src\analisisPredictivo\HistorialRiesgo.vue",
    "$baseDir\layouts\MainLayout.vue",
    "$baseDir\layouts\AuthLayout.vue",
    "$baseDir\router\index.js",
    "$baseDir\services\authService.js",
    "$baseDir\services\firestoreService.js",
    "$baseDir\services\asistenciaService.js",
    "$baseDir\services\notificacionService.js",
    "$baseDir\services\reporteService.js",
    "$baseDir\services\incentivoService.js",
    "$baseDir\services\reporteDiarioService.js",
    "$baseDir\services\alertasService.js",
    "$baseDir\services\insigniasService.js",
    "$baseDir\services\repertorioService.js",
    "$baseDir\services\intervencionService.js",
    "$baseDir\services\reporteGlobalService.js",
    "$baseDir\services\analisisPredictivoService.js",
    "$baseDir\store\index.js",
    "$baseDir\store\asistencia.js",
    "$baseDir\store\notificaciones.js",
    "$baseDir\store\reportes.js",
    "$baseDir\store\incentivos.js",
    "$baseDir\store\insignias.js",
    "$baseDir\store\repertorio.js",
    "$baseDir\views\asistencia\HomeAsistencia.vue",
    "$baseDir\views\asistencia\PanelIndicadores.vue",
    "$baseDir\views\asistencia\HistorialAsistencia.vue",
    "$baseDir\views\reportes\VistaComparativa.vue",
    "$baseDir\views\reportes\DetalleReporte.vue",
    "$baseDir\views\repertorio\HomeRepertorio.vue",
    "$baseDir\views\repertorio\VistaPasajes.vue",
    "$baseDir\views\repertorio\VistaRecomendaciones.vue",
    "$baseDir\views\intervencion\HomeIntervencion.vue",
    "$baseDir\views\intervencion\VistaProgresoIntervencion.vue",
    "$baseDir\views\reportesGlobales\HomeReporteGlobal.vue",
    "$baseDir\views\reportesGlobales\VistaComparativaGlobal.vue",
    "$baseDir\views\analisisPredictivo\HomeAnalisisPredictivo.vue",
    "$baseDir\views\analisisPredictivo\VistaRecomendaciones.vue"
)

# Crear los archivos si no existen
foreach ($file in $files) {
    if (!(Test-Path -Path $file)) {
        New-Item -ItemType File -Path $file -Force
        Write-Output "Archivo creado: $file"
    } else {
        Write-Output "Archivo ya existe: $file"
    }
}

Write-Output "Estructura de proyecto creada exitosamente."
