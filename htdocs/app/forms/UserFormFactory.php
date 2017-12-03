<?php
/**
 * Created by PhpStorm.
 * User: viktorkafka
 * Date: 28/11/2017
 * Time: 09:43
 */

namespace App\Forms;

use Nette\Application\UI\Form;

class UserFormFactory
{

    /**
     * UserFormFactory constructor.
     */
    public function __construct()
    {
    }

    /**
     * Registration form
     * @return Form
     */
    public function createSignUp()
    {
        $form = new Form();

        $form->addText('firstname', 'Jméno:')->setRequired();
        $form->addText('lastname', 'Příjmení:')->setRequired();
        $form->addEmail('email', 'E-mail:')->setRequired();
        $form->addPassword('password', 'Heslo:')->setRequired();

        $form->addSubmit('send', 'Registrovat');

        return $form;
    }

    /**
     * Login form
     * @return Form
     */
    public function createSignIn()
    {
        $form = new Form();

        $form->addEmail('email', 'E-mail:')->setRequired();
        $form->addPassword('password', 'Heslo:')->setRequired();

        $form->addSubmit('send', 'Přihlásit se');

        return $form;
    }
}