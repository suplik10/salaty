<?php

namespace App\Presenters;

use App\Forms\UserFormFactory;
use App\Model\UserManager;
use App\Model\UserModel;
use Nette;


class HomepagePresenter extends Nette\Application\UI\Presenter
{
    /**
     * Product ID
     * @var
     */
    private $productId;

    /**
     * @var UserFormFactory
     * @inject
     */
    public $userForm;

    /**
     * @var UserModel
     * @inject
     */
    public $userModel;

    protected function createComponentSignForNewsletter()
    {
        $form = $this->userForm->signForNewsletter();
        $form->onSuccess[] = [$this, 'signForNewsletterSucceeded'];
        return $form;
    }

    public function signForNewsletterSucceeded(Nette\Application\UI\Form $form)
    {
        $values = $form->getValues();
        try {
            $isSignedUp = $this->userModel->isEmailSignedForNewsletter($values->email);
            if($isSignedUp){
                throw new Nette\Neon\Exception('Tento e-mail se již nachází v databázi pro odběr novinek');
            }
            $this->userModel->signForNewsletter($values->email);
            $this->flashMessage('Přihlášení k odběru proběhlo úspěšně.', 'success');
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

    public function renderOffers()
    {
        $this->template->productId = $this->productId;
    }


    public function handleGetProductData($productId)
    {
        $this->productId = $productId;
        $this->redrawControl();
    }
}
