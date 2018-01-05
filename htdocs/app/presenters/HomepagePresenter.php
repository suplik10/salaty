<?php

namespace App\Presenters;

use App\Forms\CartFormFactory;
use App\Forms\UserFormFactory;
use App\Model\CartModel;
use App\Model\ProductModel;
use App\Model\UserManager;
use App\Model\UserModel;
use Nette;


class HomepagePresenter extends Nette\Application\UI\Presenter
{
    /**
     * Product ID
     * @persistent
     * @var
     */
    private $productId;

    /**
     * Product Name
     * @var
     */
    private $productName = '';

    /**
     * @var UserFormFactory
     * @inject
     */
    public $userForm;

    /**
     * @var CartFormFactory
     * @inject
     */
    public $cartForm;

    /**
     * @var UserModel
     * @inject
     */
    public $userModel;

    /**
     * @var ProductModel
     * @inject
     */
    public $productModel;

    /**
     * @var CartModel
     * @inject
     */
    public $cartModel;

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
            if ($isSignedUp) {
                throw new \Exception('Tento e-mail se již nachází v databázi pro odběr novinek');
            }
            $this->userModel->signForNewsletter($values->email);
            $this->flashMessage('Přihlášení k odběru proběhlo úspěšně.', 'success');
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

    public function renderDefault()
    {
        $this->template->products = $this->productModel->getProducts()->fetchAll();
    }

    public function renderOffers()
    {
        $this->template->productId = $this->productId;
        $this->template->productName = $this->productName;
        $this->template->categories = $this->getCategoriesWithProducts();
        $this->template->cart = $this->cartModel->getCart($this->user->getId())->fetchAssoc('date[]');
    }


    public function handleGetProductData($productId)
    {
        $this->productId = $productId;
        $product = $this->productModel->getProduct($productId);
        $this->productName = $product->name;
        $this->redrawControl();
    }

    public function getCategoriesWithProducts()
    {
        $categories = $this->productModel->getProducts()->fetchAssoc('category_name|id');
        return $categories;
    }

    protected function createComponentAddToCartForm()
    {
        $form = $this->cartForm->createRegisterToCartForm();

        $form->onSuccess[] = [$this, 'addProductToCart'];

        return $form;
    }

    public function addProductToCart(Nette\Application\UI\Form $form)
    {
        $values = $form->getValues();

        $today = new Nette\Utils\DateTime();

        $data = [
            'product_id' => $values->productId,
            'user_id' => $this->user->getId(),
            'date' => $values->date,
            'count' => $values->count
        ];

        try {
            $date = new Nette\Utils\DateTime($values->date);
            if ($today->format('Y-m-d') >= $date->format('Y-m-d')) {
                throw new \Exception('Na tento datum nelze objednat.');
            }
            if ($today->format('H') >= 16 && $today->modify('+1 day') >= $date->format('Y-m-d')) {
                throw new \Exception('Na tento datum nelze objednat.');
            }
            $cart = $this->cartModel->checkCartForSameOrder($date, $this->user->getId(), $values->productId);
            if ($cart) {
                $this->cartModel->removeFromCart($cart->id);
                $data['count'] = $data['count'] + $cart->count;
            }
            $this->cartModel->addProductToCart($data);
        } catch (\Exception $e) {
            //$this->template->cartError = $e->getMessage();
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

    public function handleRemoveProductFromCart($cartId)
    {
        try {

            //TODO přidat kontrolu uživatele jestli maže svoje
            $this->cartModel->removeFromCart($cartId);
            // $this->flashMessage('Odebrání z košíku proběhlo úspěšně.', 'success');
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

    public function handleRemoveAllFromCart()
    {
        try {
            $this->cartModel->removeAllFromCart($this->user->getId());
            // $this->flashMessage('Odebrání z košíku proběhlo úspěšně.', 'success');
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }


    /**
     * @return \Nette\Application\UI\Form
     */
    protected function createComponentSignInForm()
    {
        $form = $this->userForm->createSignIn();
        $form->onSuccess[] = [$this, 'signInSucceeded'];
        return $form;
    }

    public function signInSucceeded(Nette\Application\UI\Form $form)
    {
        $values = $form->getValues();

        try {
            $this->user->setExpiration('7 days', TRUE);
            $this->user->login($values->email, $values->password);
            $this->flashMessage('Přihlášení proběhlo úspěšně.', 'success');
            $this->redirect('Homepage:default');
        } catch (Nette\Security\AuthenticationException $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }
}
