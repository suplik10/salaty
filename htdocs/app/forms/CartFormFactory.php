<?php
/**
 * Created by PhpStorm.
 * User: Viki
 * Date: 21.12.2017
 * Time: 15:35
 */

namespace App\Forms;


use Nette\Application\UI\Form;
use Nette\Utils\DateTime;

class CartFormFactory
{

    public function __construct()
    {
    }

    /**
     * Form for saving products to cart
     * @return Form
     */
    public function createRegisterToCartForm()
    {
        $form = new Form();
        $date = new DateTime('+1 day');

        $form->addText('date', 'Datum:')
            ->setDefaultValue($date->format('Y-m-d'))
            ->setHtmlType('date')
            ->setRequired();
        $form->addInteger('count', 'Počet:')
            ->setDefaultValue(1)
            ->setRequired();

        $form->addHidden('productId', null);

        $form->addSubmit('send', 'Přidat do objednávky');

        return $form;
    }

}