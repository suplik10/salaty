<?php
/**
 * Created by PhpStorm.
 * User: Viki
 * Date: 9.1.2018
 * Time: 22:09
 */

namespace App\Forms;


use Nette\Application\UI\Form;

class AdminFormFactory
{

    /**
     * AdminFormFactory constructor.
     */
    public function __construct()
    {
    }

    public function createNewIngredientsForm(){
        $form = new Form();

        $form->addText('name', 'Název ingredience:')
            ->setAttribute('placeholder', '* Název ingredience')
            ->setRequired();
        $form->addSubmit('send', 'Uložit')
            ->setAttribute('class', 'btn btn-primary');

        return $form;
    }
}