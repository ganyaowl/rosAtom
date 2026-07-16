package com.hackathon.radiationmonitor

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import kotlin.random.Random

class MeowService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private var mediaPlayer: MediaPlayer? = null

    private val repeatTask = object : Runnable {
        override fun run() {
            triggerCharge()
            scheduleNext()
        }
    }

    override fun onCreate() {
        super.onCreate()
        createChannels()
        startForeground(SERVICE_NOTIFICATION_ID, serviceNotification())
        scheduleNext()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY

    override fun onDestroy() {
        handler.removeCallbacks(repeatTask)
        releasePlayer()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun scheduleNext() {
        handler.removeCallbacks(repeatTask)
        handler.postDelayed(repeatTask, Random.nextLong(MIN_DELAY_MS, MAX_DELAY_MS + 1))
    }

    private fun triggerCharge() {
        playMusicFromStart()
        sendBroadcast(Intent(ACTION_CHARGE_TRIGGERED).setPackage(packageName))

        val dialogIntent = Intent(this, MainActivity::class.java).apply {
            action = ACTION_SHOW_CHARGE
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val dialogPendingIntent = PendingIntent.getActivity(
            this,
            1001,
            dialogIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val notification = NotificationCompat.Builder(this, ALERT_CHANNEL_ID)
            .setSmallIcon(android.R.drawable.stat_notify_error)
            .setContentTitle("Списание средств")
            .setContentText("У вас списали 1000 рублей.")
            .setStyle(NotificationCompat.BigTextStyle().bigText("У вас списали 1000 рублей."))
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setAutoCancel(true)
            .setContentIntent(dialogPendingIntent)
            .setFullScreenIntent(dialogPendingIntent, true)
            .build()
        getSystemService(NotificationManager::class.java).notify(ALERT_NOTIFICATION_ID, notification)
    }

    private fun playMusicFromStart() {
        releasePlayer()
        runCatching {
            val descriptor = assets.openFd("jewish.mp3")
            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build(),
                )
                setDataSource(descriptor.fileDescriptor, descriptor.startOffset, descriptor.length)
                descriptor.close()
                setOnCompletionListener { releasePlayer() }
                prepare()
                start()
            }
        }
    }

    private fun releasePlayer() {
        mediaPlayer?.runCatching {
            if (isPlaying) stop()
            release()
        }
        mediaPlayer = null
    }

    private fun createChannels() {
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(
            NotificationChannel(
                SERVICE_CHANNEL_ID,
                "Фоновая работа",
                NotificationManager.IMPORTANCE_LOW,
            ),
        )
        manager.createNotificationChannel(
            NotificationChannel(
                ALERT_CHANNEL_ID,
                "Списание средств",
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = "Повторяющиеся уведомления о списании"
                enableVibration(true)
            },
        )
    }

    private fun serviceNotification() = NotificationCompat.Builder(this, SERVICE_CHANNEL_ID)
        .setSmallIcon(android.R.drawable.ic_media_play)
        .setContentTitle("Radiation Monitor Meow")
        .setContentText("Повторяющиеся уведомления активны")
        .setOngoing(true)
        .setPriority(NotificationCompat.PRIORITY_LOW)
        .setContentIntent(
            PendingIntent.getActivity(
                this,
                1000,
                Intent(this, MainActivity::class.java),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            ),
        )
        .build()

    companion object {
        const val ACTION_CHARGE_TRIGGERED = "com.hackathon.radiationmonitor.meow.CHARGE_TRIGGERED"
        const val ACTION_SHOW_CHARGE = "com.hackathon.radiationmonitor.meow.SHOW_CHARGE"

        private const val SERVICE_CHANNEL_ID = "meow_service"
        private const val ALERT_CHANNEL_ID = "meow_charge_alerts"
        private const val SERVICE_NOTIFICATION_ID = 7001
        private const val ALERT_NOTIFICATION_ID = 7002
        private const val MIN_DELAY_MS = 30_000L
        private const val MAX_DELAY_MS = 60_000L
    }
}
