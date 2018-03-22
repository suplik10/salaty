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
use Tracy\Debugger;

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
        $form->addHidden('categoryId', null);

        $form->addSubmit('send', 'Přidat do objednávky');

        $form->onSuccess[] = [$this, 'log'];

        return $form;
    }

    public function createOrderDescription()
    {
        $form = new Form();

        $form->addTextArea('description', 'Poznámka k objednávce:');
        $form->addSubmit('send', 'Odeslat objednávku');

        return $form;
    }

    public function log(Form $form)
    {
        $values = $form->getValues();
        Debugger::log($values, "form-" . str_replace('\\', "-", $form->getName()));
    }
}