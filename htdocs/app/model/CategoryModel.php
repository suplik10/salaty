<?php
/**
 * Created by PhpStorm.
 * User: viktorkafka
 * Date: 10/01/2018
 * Time: 07:59
 */

namespace App\Model;


use Nette\Database\Context;

class CategoryModel
{
    /**
     * @var Context
     */
    private $db;

    public function __construct(Context $db)
    {
        $this->db = $db;
    }

    /**
     * Returns all categories
     * @return \Nette\Database\ResultSet
     */
    public function getAllCategories()
    {
        return $this->db->query("SELECT * FROM category");
    }

    public function changeCategoryState($categoryId, $state)
    {
        $this->db->query("UPDATE category SET active = ? WHERE id = ?", $state, $categoryId);
    }

    public function addCategory($data)
    {
        $this->db->query("INSERT INTO category", $data);
    }
}