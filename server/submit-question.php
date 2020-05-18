<?php
$EMAIL = $_POST['email'];
$EMAIL_DOMAIN=substr($EMAIL, strpos($EMAIL, "@") + 1);
$QUESTION = $_POST['question'];
$DATE = str_replace(':', '_', date('c'));

if(strlen($QUESTION) == 0) {
  ?>
    <h1>pro tip</h1>
    <p>
      write more than 0 characters in the question box.
    </p>
<p><a href="/q+a"></a></p>
  <?php
  exit;
}

if(strlen($QUESTION) >= 3000) {
  ?>
    <h1>oh no!</h1>
    <p>
      that question was far too long.
    </p>
<p><a href="/q+a">try something else</a></p>
  <?php
  exit;
}
if(!empty($EMAIL)) {
  if(strlen($EMAIL) > 320) {
    ?>
      <h1>oh no!</h1>
      <p>
        your email is too long
      </p>
  <p><a href="/q+a">fix that</a></p>
    <?php
    exit;
  }
  if(strlen($EMAIL_DOMAIN) > 255) {
    ?>
      <h1>oh no!</h1>
      <p>
        your email is too long
      </p>
  <p><a href="/q+a">fix that</a></p>
    <?php
    exit;
  }
  if((strlen($EMAIL) - strlen($EMAIL_DOMAIN) - 1) > 64) {
    ?>
      <h1>oh no!</h1>
      <p>
        your email is too long
      </p>
  <p><a href="/q+a">fix that</a></p>
    <?php
    exit;
  }
  if (!checkdnsrr($EMAIL_DOMAIN, 'MX')) {
    ?>
      <h1>oh no!</h1>
      <p>
        your email is not valid (domain is not configured to recieve mail)
      </p>
  <p><a href="/q+a">fix that</a></p>
  <p><a href="https://stackoverflow.com/a/12026863">learn how this check works</a></p>
    <?php
    exit;
  }
}

if (!is_dir('/home/dave/qa-data')) {
  // dir doesn't exist, make it
  mkdir('/home/dave/qa-data');
}

$json_data = array ('question'=>$QUESTION,'email'=>$EMAIL);
$json = json_encode($json_data);

file_put_contents('/home/dave/qa-data/' . $DATE . '.json', $json);

header('Location: /q+a/thankyou');
?>
