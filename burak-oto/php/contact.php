<?php
header('Content-Type: application/json; charset=utf-8');
define('ALICI_MAIL','info@burakotokurtarici.com');
define('GONDEREN_MAIL','noreply@burakotokurtarici.com');
define('SITE_ADI','Burak Oto Kurtarıcı');
if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false]);exit;}
function t($v){return htmlspecialchars(strip_tags(trim($v)),ENT_QUOTES,'UTF-8');}
$ad=t($_POST['name']??'');$tel=t($_POST['phone']??'');
$eposta=filter_var(trim($_POST['email']??''),FILTER_SANITIZE_EMAIL);
$hizmet=t($_POST['service']??'');$mesaj=t($_POST['message']??'');
if(empty($ad)||empty($tel)){echo json_encode(['success'=>false]);exit;}
if(!empty($_POST['website'])){echo json_encode(['success'=>true]);exit;}
$konu='=?UTF-8?B?'.base64_encode('['.SITE_ADI.'] '.$ad).'?=';
$icerik="Ad: $ad\nTel: $tel\nMail: ".($eposta?:'Yok')."\nHizmet: ".($hizmet?:'Yok')."\n---\n$mesaj\n---\n".date('d.m.Y H:i');
$h="From: =?UTF-8?B?".base64_encode(SITE_ADI)."?= <".GONDEREN_MAIL.">\r\nReply-To: ".($eposta?:GONDEREN_MAIL)."\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64";
echo json_encode(['success'=>(bool)mail(ALICI_MAIL,$konu,base64_encode($icerik),$h)]);
