<?php
/**
 * Created by PhpStorm.
 * User: viktorkafka
 * Date: 05/01/2018
 * Time: 10:59
 */

namespace App\Presenters;


use App\Forms\AdminFormFactory;
use App\Forms\UserFormFactory;
use App\Model\IngredientModel;
use App\Model\UserModel;
use Nette\Application\UI\Form;
use Nette\Application\UI\Presenter;

class AdminPresenter extends Presenter
{
    /**
     * @var AdminFormFactory
     * @inject
     */
    public $adminForm;

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

    /**
     * @var IngredientModel
     * @inject
     */
    public $ingredientModel;

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

    protected function createComponentAddNewIngredientsForm()
    {
        $form = $this->adminForm->createNewIngredientsForm();
        $form->onSuccess[] = [$this, 'addNewIngredientSucceeded'];
        return $form;
    }

    public function addNewIngredientSucceeded(Form $form)
    {
        $values = $form->getValues();
        try {
            $this->ingredientModel->addIngredient($values);
            $this->flashMessage('Ingredience byla úspěšně vytvořena.', 'success');
            $this->redrawControl();
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }


    public function handleDeleteIngredient($ingredientId)
    {
        try {
            $this->ingredientModel->removeIngredientFromAllProducts($ingredientId);
            $this->ingredientModel->removeIngredient($ingredientId);
            $this->flashMessage('Ingredience byla úspěšně smazána.', 'success');
            $this->redrawControl();
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

    public function renderDefault()
    {
        $this->template->ingredients = $this->ingredientModel->getAllIngredients()->fetchAll();
    }

}