<?php
/**
 * Created by PhpStorm.
 * User: viktorkafka
 * Date: 05/01/2018
 * Time: 10:59
 */

namespace App\Presenters;


use App\Forms\UserFormFactory;
use App\Model\UserModel;
use Nette\Application\UI\Form;
use Nette\Application\UI\Presenter;

class AdminPresenter extends Presenter
{
    /**
     * @var UserFormFactory
     * @inject
     */
    public $userForm;


    /**
     * @var UserModel
     *
     * @inject
     */
    public $userModel;

    protected function createComponentSignForNewsletter()
    {
        $form = $this->userForm->signForNewsletter();
        $form->onSuccess[] = [$this, 'signForNewsletterSucceeded'];
        return $form;
    }

    public function signForNewsletterSucceeded(Form $form)
    {
        $values = $form->getValues();
        try {
            $isSignedUp = $this->userModel->isEmailSignedForNewsletter($values->email);
            if ($isSignedUp) {
                throw new \Exception('Tento e-mail se již nachází v databázi pro odběr novinek');
            }
            $this->userModel->signForNewsletter($values->email);
            $this->flashMessage('Přihlášení k odběru proběhlo úspěšně.', 'success');
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

}