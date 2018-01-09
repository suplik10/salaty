<?php

namespace App\Presenters;

use App\Forms\CartFormFactory;
use App\Forms\UserFormFactory;
use App\Model\CartModel;
use App\Model\OrderModel;
use App\Model\ProductModel;
use App\Model\UserManager;
use App\Model\UserModel;
use Nette;


class HomepagePresenter extends Nette\Application\UI\Presenter
{
    const CATEGORY_RAW_ZAKUSKY = 2;

    /**
     * Product ID
     * @var
     */
    private $productId;

    /**
     * Product category ID
     * @var
     */
    private $categoryId;

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

    /**
     * @var OrderModel
     * @inject
     */
    public $orderModel;

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
        $this->template->wallet = $this->orderModel->getUserWallet($this->user->getId());
    }

    public function renderOffers()
    {
        $this->template->productId = $this->productId;
        $this->template->productName = $this->productName;
        $this->template->categoryId = $this->categoryId;
        $this->template->categories = $this->getCategoriesWithProducts();
        $this->template->cart = $this->cartModel->getCart($this->user->getId())->fetchAssoc('date[]');
    }


    public function handleGetProductData($productId)
    {
        $this->productId = $productId;
        $product = $this->productModel->getProduct($productId);
        $this->productName = $product->name;
        $this->categoryId = $product->category_id;
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
        $date2 = new Nette\Utils\DateTime('+2 days');

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

            if ($date->format('N') > 5) { //chce objednávat na víkend
                throw new \Exception('Na tento datum nelze objednat.');
            }

            if ($today->format('N') > 5) { //je víkend
                throw new \Exception('O víkendu nelze objednávat.');
            }

            if ($values->categoryId === self::CATEGORY_RAW_ZAKUSKY  && $today->format('W') >= $date->format('W')) { //raw zákusky objednávání pouze na další týden
                throw new \Exception('Na tento datum nelze RAW zákusky objednat.');
            }

            $cart = $this->cartModel->checkCartForSameOrder($date, $this->user->getId(), $values->productId);
            if ($cart) {
                $this->cartModel->removeFromCart($cart->id);
                $data['count'] = $data['count'] + $cart->count;
            }
            $this->cartModel->addProductToCart($data);
        } catch (\Exception $e) {
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


    public function handleCreateOrder()
    {
        try {
            //TODO přidat kontrolu datumu objednávky, jako je při přidávání do košíku
            $cart = $this->cartModel->getCart($this->user->getId())->fetchAll();
            $totalPrice = 0;
            foreach ($cart as $product) {
                $totalPrice = $totalPrice + ($product->price * $product->count);
            }
            $date = new Nette\Utils\DateTime();

            $order = $this->orderModel->createOrder($this->user->getId(), $totalPrice, $date);
            $this->orderModel->addProductsToOrder($cart, $order->id);
            $this->cartModel->removeAllFromCart($this->user->getId());
            $this->flashMessage('Objednávka proběhla úspěšně. Na Vaši e-mailovou adresu byl zaslán email se souhrnem objednávky.', 'success');

        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'error');
        }
    }
}
