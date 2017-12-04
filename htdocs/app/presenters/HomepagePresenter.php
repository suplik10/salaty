<?php

namespace App\Presenters;

use Nette;


class HomepagePresenter extends Nette\Application\UI\Presenter
{
    /**
     * Product ID
     * @var
     */
    private $productId;

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
