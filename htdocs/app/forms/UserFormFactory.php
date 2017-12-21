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

        $form->addText('firstname', 'Jméno:')
            ->setAttribute('placeholder', '* Jméno')
            ->setRequired();
        $form->addText('lastname', 'Příjmení:')
            ->setAttribute('placeholder', '* Příjmení')
            ->setRequired();
        $form->addEmail('email', 'E-mail:')
            ->setAttribute('placeholder', '* E-mail')
            ->setRequired();
        $form->addText('phone', 'Telefon:')
            ->setAttribute('placeholder', '* Telefon')
            ->setRequired();
        $form->addPassword('password', 'Heslo:')
            ->setAttribute('placeholder', '* Heslo')
            ->setRequired();

        $form->addSubmit('send', 'Registrovat')
            ->setAttribute('class', 'btn btn-primary');

        return $form;
    }

    /**
     * Login form
     * @return Form
     */
    public function createSignIn()
    {
        $form = new Form();

        $form->addEmail('email', 'E-mail:')
            ->setAttribute('placeholder', 'E-mail')
            ->setRequired();
        $form->addPassword('password', 'Heslo:')
            ->setAttribute('placeholder', 'Heslo')
            ->setRequired();

        $form->addSubmit('send', 'Přihlásit se')
            ->setAttribute('class', 'btn btn-primary');

        return $form;
    }

    /**
     * Sign up for newsletter form
     * @return Form
     */
    public function signForNewsletter()
    {
        $form = new Form();

        $form->addEmail('email', 'E-mail:')
            ->setAttribute('placeholder', 'Váš e-mail')
            ->setRequired();
        $form->addSubmit('send', 'Odeslat')
            ->setAttribute('class', 'btn btn-primary');

        return $form;
    }

    /**
     * Edit user profile form
     * @param $user
     * @return Form
     */
    public function editProfile($user, $isSignedForNewsletter)
    {
        $form = new Form();

        $form->addText('firstname', 'Jméno:')
            ->setAttribute('placeholder', '* Jméno')
            ->setDefaultValue($user->identity->firstname)
            ->setRequired();
        $form->addText('lastname', 'Příjmení:')
            ->setDefaultValue($user->identity->lastname)
            ->setAttribute('placeholder', '* Příjmení')
            ->setRequired();
        $form->addEmail('email', 'E-mail:')
            ->setDefaultValue($user->identity->email)
            ->setAttribute('placeholder', '* E-mail')
            ->setRequired();
        $form->addText('phone', 'Telefon:')
            ->setDefaultValue($user->identity->phone)
            ->setAttribute('placeholder', '* Telefon')
            ->setRequired();
        $form->addPassword('old_password', 'Staré heslo:')
            ->setAttribute('placeholder', 'Staré Heslo');
        $form->addPassword('new_password', 'Nové heslo:')
            ->setAttribute('placeholder', 'Nové heslo');
        $form->addPassword('new_password_2', 'Nové heslo znovu:')
            ->setAttribute('placeholder', 'Nové heslo znovu');

        if ($isSignedForNewsletter) {
            $newsletter = TRUE;
        } else {
            $newsletter = FALSE;
        }

        $form->addCheckbox('newsletter', 'Chcete odebírat novinky?')->setDefaultValue($newsletter);

        $form->addSubmit('send', 'Uložit')
            ->setAttribute('class', 'btn btn-primary');


        return $form;
    }
}