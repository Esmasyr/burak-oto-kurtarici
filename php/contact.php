<?php
// ===================================================
//  BURAK OTO KURTARICI — php/contact.php
//  
// ===================================================

define('ALICI_MAIL',    'info@burakotokurtarici.com');  // Formun geleceği e-posta
define('ALICI_ISIM',    'Burak Oto Kurtarıcı');
define('GONDEREN_MAIL', 'noreply@burakotokurtarici.com'); // Hosting domain'iniz
define('SITE_ADI',      'Burak Oto Kurtarıcı');
// -------------------------------------------

header('Content-Type: application/json; charset=utf-8');

// Sadece POST isteği kabul et
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit;
}

// Girdi temizleme
function temizle($v) {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}

// Verileri al
$ad      = temizle($_POST['name']    ?? '');
$tel     = temizle($_POST['phone']   ?? '');
$eposta  = filter_var(trim($_POST['email']   ?? ''), FILTER_SANITIZE_EMAIL);
$hizmet  = temizle($_POST['service']  ?? '');
$mesaj   = temizle($_POST['message']  ?? '');

// Zorunlu alan kontrolü
if (empty($ad) || empty($tel)) {
    echo json_encode(['success' => false, 'message' => 'Ad ve telefon zorunludur.']);
    exit;
}

// E-posta format kontrolü
if (!empty($eposta) && !filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Geçersiz e-posta.']);
    exit;
}

// Honeypot spam koruması (gizli alan doluysa bot demektir)
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]); // bota başarılı göster
    exit;
}

// E-posta konusu
$konu = '=?UTF-8?B?' . base64_encode('[' . SITE_ADI . '] Yeni Mesaj: ' . $ad) . '?=';

// E-posta içeriği
$icerik  = "Yeni iletişim formu mesajı:\n\n";
$icerik .= "Ad Soyad : " . $ad . "\n";
$icerik .= "Telefon  : " . $tel . "\n";
$icerik .= "E-Posta  : " . ($eposta ?: 'Belirtilmedi') . "\n";
$icerik .= "Hizmet   : " . ($hizmet ?: 'Belirtilmedi') . "\n";
$icerik .= "----------------------------------------\n";
$icerik .= "Mesaj:\n" . $mesaj . "\n";
$icerik .= "----------------------------------------\n";
$icerik .= "Tarih: " . date('d.m.Y H:i') . "\n";
$icerik .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

// E-posta başlıkları
$basliklar  = "From: =?UTF-8?B?" . base64_encode(SITE_ADI) . "?= <" . GONDEREN_MAIL . ">\r\n";
$basliklar .= "Reply-To: " . (empty($eposta) ? GONDEREN_MAIL : $eposta) . "\r\n";
$basliklar .= "MIME-Version: 1.0\r\n";
$basliklar .= "Content-Type: text/plain; charset=UTF-8\r\n";
$basliklar .= "Content-Transfer-Encoding: base64\r\n";
$basliklar .= "X-Mailer: PHP/" . phpversion();

// Gönder
$sonuc = mail(ALICI_MAIL, $konu, base64_encode($icerik), $basliklar);

echo json_encode(['success' => (bool)$sonuc]);
