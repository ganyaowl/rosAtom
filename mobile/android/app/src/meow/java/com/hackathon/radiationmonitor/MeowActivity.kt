package com.hackathon.radiationmonitor

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat

class MeowActivity : ComponentActivity() {
    private var showChargeDialog by mutableStateOf(false)

    private val notificationPermission = registerForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { startRepeatingService() }

    private val chargeReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            showChargeDialog = true
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        showChargeDialog = intent.action == MeowService.ACTION_SHOW_CHARGE
        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Color(0xFF0A84FF),
                    background = Color(0xFF0B1120),
                    surface = Color(0xFF171B27),
                    onBackground = Color(0xFFF5F6FA),
                    onSurface = Color(0xFFF5F6FA),
                ),
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.background)
                        .padding(24.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                    ) {
                        Text("Radiation Monitor", fontSize = 30.sp, fontWeight = FontWeight.ExtraBold)
                        Spacer(Modifier.height(12.dp))
                        Text(
                            "Повторяющиеся уведомления активны. Следующее событие произойдёт через 30–60 секунд.",
                            textAlign = TextAlign.Center,
                            color = Color(0xFF9AA3B2),
                            lineHeight = 22.sp,
                        )
                    }
                }

                if (showChargeDialog) {
                    AlertDialog(
                        onDismissRequest = { showChargeDialog = false },
                        title = { Text("Списание средств", fontWeight = FontWeight.ExtraBold) },
                        text = { Text("У вас списали 1000 рублей.", fontSize = 18.sp) },
                        confirmButton = {
                            Button(
                                onClick = { showChargeDialog = false },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD92D20)),
                            ) {
                                Text("Понятно", fontWeight = FontWeight.Bold)
                            }
                        },
                        dismissButton = {
                            TextButton(onClick = { showChargeDialog = false }) { Text("Закрыть") }
                        },
                    )
                }
            }
        }

        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            notificationPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
        } else {
            startRepeatingService()
        }
    }

    override fun onStart() {
        super.onStart()
        val filter = IntentFilter(MeowService.ACTION_CHARGE_TRIGGERED)
        if (Build.VERSION.SDK_INT >= 33) {
            registerReceiver(chargeReceiver, filter, RECEIVER_NOT_EXPORTED)
        } else {
            @Suppress("UnspecifiedRegisterReceiverFlag")
            registerReceiver(chargeReceiver, filter)
        }
    }

    override fun onStop() {
        unregisterReceiver(chargeReceiver)
        super.onStop()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        if (intent.action == MeowService.ACTION_SHOW_CHARGE) showChargeDialog = true
    }

    private fun startRepeatingService() {
        ContextCompat.startForegroundService(this, Intent(this, MeowService::class.java))
    }
}
