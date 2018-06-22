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
use V\Services\NotificationMail;


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
        $this->template->productIngredients = $this->productModel->getProductsWithIngredients()->fetchAssoc('id[]');
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

        $data = [
            'product_id' => $values->productId,
            'user_id' => $this->user->getId(),
            'date' => $values->date,
            'count' => $values->count
        ];

        try {
            $date = new Nette\Utils\DateTime($values->date);
            $this->validateOrder($date, $values->categoryId);

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

    protected function createComponentOrderDescription()
    {
        $form = $this->cartForm->createOrderDescription();
        $form->onSuccess[] = [$this, 'orderDescriptionSucceeded'];

        return $form;
    }

    public function orderDescriptionSucceeded(Nette\Application\UI\Form $form)
    {
        $values = $form->getValues();
        if (empty($values->description)) {
            $values->description = null;
        }
        $this->cartModel->addDescription($values->description, $this->user->getId());
        $this->createOrder();
    }

    public function createOrder()
    {
        try {
            $cart = $this->cartModel->getCart($this->user->getId())->fetchAll();
            if (!$cart) {
                throw new \Exception('Objednávka nesmí být prázdná.');
            }
            $totalPrice = 0;
            $description = "";
            foreach ($cart as $product) {
                $totalPrice = $totalPrice + ($product->price * $product->count);
                $description = $product->order_description;
                $this->validateOrder($product->date, $product->category_id);
            }
            $date = new Nette\Utils\DateTime();

            $mailCart = $this->cartModel->getCart($this->user->getId())->fetchAssoc('date[]');

            $order = $this->orderModel->createOrder($this->user->getId(), $totalPrice, $date, $description);
            $this->orderModel->addProductsToOrder($cart, $order->id);
            $this->cartModel->removeAllFromCart($this->user->getId());


            $mailData = [
                'cart' => $mailCart,
                'orderDate' => $date->format('d. m. Y H:i')
            ];
            $mail = new NotificationMail($mailData, $this->user->identity->email, NotificationMail::ORDER, 'SalátyObe - Shrnutí objednávky');
            $mail->setBcc('salatyob@seznam.cz');
            $mail->send();

            $this->flashMessage('Objednávka proběhla úspěšně. Na Vaši e-mailovou adresu byl zaslán email se souhrnem objednávky.', 'success');

        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

    public function validateOrder(Nette\Utils\DateTime $date, $categoryId)
    {
        $today = new Nette\Utils\DateTime();
        $tomorrow = new Nette\Utils\DateTime('+1 day');

        $orderRestriction = $this->orderModel->getOrderRestrictionsByDate($date)->fetch();
        if (!empty($orderRestriction)) {
            throw new \Exception('Na tento datum nelze objednat.');
        }

        if ($date->format('Y-m-d') == '2018-03-30' || $date->format('Y-m-d') == '2018-04-02') {
            throw new \Exception('Na tento datum nelze objednat.');
        }
        if ($today->format('Y-m-d') >= $date->format('Y-m-d')) {
            throw new \Exception('Na tento datum nelze objednat.');
        }

        if ($today->format('N') > 6 && $today->format('H') >= 12 && $date->format('W') == ($today->format('W') + 1) && $date->format('N') == 1) { //je neděle a víc než 12:00
            throw new \Exception('Na tento datum nelze objednat.');
        }

        if ($today->format('N') == 5 && $today->format('H') >= 16 && $date->format('W') == ($today->format('W') + 1) && $date->format('N') == 1) { //je pátek > 16:00 a objednává na pondělí
            throw new \Exception('Na tento datum nelze objednat.');
        }

        if ($today->format('H') >= 16 && $tomorrow->format('Y-m-d') >= $date->format('Y-m-d')) { //je >16:00 a objednává na další den
            throw new \Exception('Na tento datum nelze objednat.');
        }

        if ($date->format('N') > 5) { //chce objednávat na víkend
            throw new \Exception('Na víkend nelze objednat.');
        }

        if ($categoryId == self::CATEGORY_RAW_ZAKUSKY &&
            ((int)$today->format('W') >= (int)$date->format('W')
                || $date->format('N') != 3
                || ((int)$today->format('N') == 5 && $today->format('H') >= 16 && $date->format('W') == ($today->format('W') + 1))
            )) { //raw zákusky objednávání pouze na další týden
            throw new \Exception('Na tento datum nelze RAW zákusky objednat.');
        }
    }
}
