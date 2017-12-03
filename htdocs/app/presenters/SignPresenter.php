<?php
/**
 * Created by PhpStorm.
 * User: viktorkafka
 * Date: 28/11/2017
 * Time: 09:34
 */

namespace App\Presenters;


use App\Forms\UserFormFactory;
use Nette\Application\UI\Presenter;

class SignPresenter extends Presenter
{
    /**
     * @var UserFormFactory
     * @inject
     */
    public $userForm;

    /**
     * @return \Nette\Application\UI\Form
     */
    protected function createComponentSignUpForm()
    {
        $form = $this->userForm->createSignUp();
        $form->onSuccess[] = [$this, 'signUpSucceeded'];
        return $form;
    }


}