const PORT = process.env.PORT || 4000;
const URL = `http://localhost:${PORT}/zones/trigger-alert`;

async function main() {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Ошибка:", data);
      process.exit(1);
    }
    console.log(`🚨 Аварийное событие запущено в зоне: ${data.triggered.name}`);
    console.log(`   Уровень радиации: ${data.triggered.level}`);
  } catch (err) {
    console.error("Не удалось подключиться к серверу. Убедитесь, что запущен `npm start`.");
    console.error(err.message);
    process.exit(1);
  }
}

main();
