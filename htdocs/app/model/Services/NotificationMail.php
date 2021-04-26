<?php

namespace V\Services;


use Latte\Engine;
use Nette\Http\FileUpload;
use Nette\Mail\Message;
use Nette\Mail\SendmailMailer;

class NotificationMail
{
    const
        NEW_REGISTRATION = 'newRegistration.latte',
        ORDER = 'order.latte',
        ACCOUNT_ACTIVATION = 'accountActivation.latte',
        LOST_PASSWORD = 'lostPassword.latte';

    /**
     * @var
     */
    private $data = array();

    /**
     * @var String Předmět emailu
     */
    private $subject;

    /**
     * @var String email příjemce
     */
    private $to;

    /**
     * @var String email nebo jméno odesílatele
     */
    private $from;

    /**
     * @var String šablona pro email
     */
    private $mailTemplate;

    /**
     * @var
     */
    private $files;

    private $bcc;

    /**
     * NotificationMail constructor.
     * @param $data
     * @param $to
     * @param $mailTemplate
     * @param $subject
     * @param string $from
     */
    public function __construct($data, $to, $mailTemplate, $subject, $from = 'salatyob@seznam.cz')
    {
        $this->data = $data;
        $this->to = $to;
        $this->from = $from;
        $this->mailTemplate = $mailTemplate;
        $this->subject = $subject;
    }

    /**
     * Odeslání emailu
     * @throws \Exception
     * @throws \Throwable
     */
    public function send()
    {
        $mail = new Message();
        $latte = new Engine();
        $data = $this->data;
        $mail->setFrom($this->from)->setHtmlBody($latte->renderToString(__DIR__ . '/mail/' . $this->mailTemplate, $data));
        $mail->addTo(trim($this->to));
        $mail->setSubject($this->subject);
        if (!empty($this->files)) {
            foreach ($this->files as $file) {
                $mail->addAttachment($file['path']);
            }
        }
        if (!empty($this->bcc)) {
            $mail->addBcc($this->bcc);
        }
        //$mail->addBcc('cheaas@gmail.com');

        $mailer = new SendmailMailer();
        $mailer->send($mail);

    }

    /**
     * @param $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }

    /**
     * @param $subject
     */
    public function setSubject($subject)
    {
        $this->subject = $subject;
    }

    /**
     * @param $to
     */
    public function setTo($to)
    {
        $this->to = $to;
    }

    /**
     * @param $from
     */
    public function setFrom($from)
    {
        $this->from = $from;
    }

    /**
     * @param $mailTemplate
     */
    public function setMailTemplate($mailTemplate)
    {
        $this->mailTemplate = $mailTemplate;
    }

    /**
     * @param $files
     */
    public function setFiles($files)
    {
        $this->files = $files;
    }

    public function setBcc($bcc)
    {
        $this->bcc = $bcc;
    }

}