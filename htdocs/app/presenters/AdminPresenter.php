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
use App\Model\CategoryModel;
use App\Model\IngredientModel;
use App\Model\ProductModel;
use App\Model\UserModel;
use Nette\Application\UI\Form;
use Nette\Application\UI\Presenter;
use Nette\Http\FileUpload;
use Nette\Utils\Image;
use Nette\Utils\Strings;

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

    /**
     * @var ProductModel
     * @inject
     */
    public $productModel;

    /**
     * @var CategoryModel
     * @inject
     */
    public $categoryModel;

    /**
     * @persistent
     * @var
     */
    public $product_id;

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

    }

    public function renderIngredient()
    {
        $this->template->ingredients = $this->ingredientModel->getAllIngredients()->fetchAll();
    }

    public function renderProduct()
    {
        $this->template->products = $this->productModel->getAllProducts()->fetchAll();
    }

    public function renderCategory()
    {
        $this->template->categories = $this->categoryModel->getAllCategories();
    }

    public function renderProductDetail()
    {
        $this->template->productIngredients = $this->productModel->getProductIngredients($this->product_id)->fetchAll();
    }

    protected function createComponentAddNewCategoryForm()
    {
        $form = $this->adminForm->createNewCategoryForm();
        $form->onSuccess[] = [$this, 'addNewCategorySucceeded'];
        return $form;
    }

    public function addNewCategorySucceeded(Form $form)
    {
        $values = $form->getValues();
        try {
            $this->categoryModel->addCategory($values);
            $this->flashMessage('Kategorie produktů byla úspěšně přidána.', 'success');
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

    public function handleActivateCategory($categoryId)
    {
        $this->categoryModel->changeCategoryState($categoryId, 1);
        $this->redrawControl();
    }

    public function handleDeactivateCategory($categoryId)
    {
        $this->categoryModel->changeCategoryState($categoryId, 0);
        $this->redrawControl();
    }

    public function handleChangeProductState($productId, $state)
    {
        $this->productModel->changeProductState($productId, $state);
        $this->redrawControl();
    }

    protected function createComponentEditProductForm()
    {
        $product = $this->productModel->getProduct($this->product_id);
        $form = $this->adminForm->createEditProduct($product);
        $form->onSuccess[] = [$this, 'editProduct'];
        return $form;
    }

    public function editProduct(Form $form)
    {
        $values = $form->getValues();
        try {
            $data = [
                'id' => $this->product_id,
                'name' => $values->name,
                'description' => $values->description,
                'price' => $values->price,
                'category_id' => $values->category_id,
                'weight' => $values->weight,
                'rank' => $values->rank,
            ];

            if ($values->img->isImage() && $values->img->isOk()) {
                $imgPath = '/data/products/' . date("Y-m-d-h-i-s") . "-" . $values->img->name;
                $thumbPath = '/data/products/thumb/' . date("Y-m-d-h-i-s") . "-" . $values->img->name;

                $this->formatImg($values->img, $imgPath, $thumbPath);
                $this->productModel->changeProductImg($imgPath, $this->product_id);
            }


            $ingredients = [];
            foreach ($values->ingredients as $ingredient) {
                $ingredients[$ingredient] = [
                    'product_id' => (int)$this->product_id,
                    'ingredient_id' => $ingredient,
                ];
            }

            $this->productModel->editProduct($data, $ingredients, $values->ingredients);

            $this->flashMessage('Editace proběhla úspěšně.', 'success');
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }

    }

    /**
     * Naformátování fotek na potřebné rozměry a vytvoření thumbu
     *
     * @param FileUpload $file
     * @param $imgPath
     * @param $thumbPath
     */
    public function formatImg(FileUpload $file, $imgPath, $thumbPath)
    {
        $path = WWW_DIR . $imgPath;
        $file->move($path);

        $image = Image::fromFile(WWW_DIR . $imgPath);
        /*    $image->resize(640, null);
            $image->resize(640, 480, Image::EXACT);
            $image->sharpen();*/
        $image->save(WWW_DIR . $imgPath);


        /*        $image->resize(160, 120, Image::EXACT);
                $image->sharpen();
                $image->save(WWW_DIR . $thumbPath);*/
    }

    protected function createComponentEditProductIngredientsForm()
    {
        $ingredients = $this->productModel->getProductIngredients($this->product_id)->fetchAll();
        $form = $this->adminForm->createEditProductIngredients($ingredients);
        $form->onSuccess[] = [$this, 'editProductIngredients'];
        return $form;
    }

    public function editProductIngredients(Form $form)
    {
        $values = $form->getValues();
        try {
            $this->productModel->editProductIngredients($values, $this->product_id);
            $this->flashMessage('Editace ingrediencí proběhla úspěšně.', 'success');
        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }

    protected function createComponentNewProductForm()
    {
        $form = $this->adminForm->createAddNewProduct();
        $form->onSuccess[] = [$this, 'addProduct'];
        return $form;
    }

    public function addProduct(Form $form)
    {
        $values = $form->getValues();
        try {
            if ($values->img->isImage() && $values->img->isOk()) {
                $imgPath = '/data/products/' . date("Y-m-d-h-i-s") . "-" . $values->img->name;
                $thumbPath = '/data/products/thumb/' . date("Y-m-d-h-i-s") . "-" . $values->img->name;

                $this->formatImg($values->img, $imgPath, $thumbPath);
                //$this->productModel->changeProductImg($imgPath, $this->product_id);
            }

            $data = [
                'name' => $values->name,
                'description' => $values->description,
                'img' => $imgPath,
                'price' => $values->price,
                'category_id' => $values->category_id,
                'weight' => $values->weight,
                'rank' => $values->rank,
            ];

            $this->productModel->addProduct($data, $values->ingredients);

        } catch (\Exception $e) {
            $this->flashMessage($e->getMessage(), 'danger');
        }
    }
}