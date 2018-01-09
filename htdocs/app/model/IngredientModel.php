<?php
/**
 * Created by PhpStorm.
 * User: Viki
 * Date: 9.1.2018
 * Time: 22:15
 */

namespace App\Model;


use Nette\Database\Context;

class IngredientModel
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
     * Create new ingredient
     * @param $data
     */
    public function addIngredient($data)
    {
        $this->db->query("INSERT INTO ingredients", $data);
    }

    /**
     * Get all ingredients
     * @return \Nette\Database\ResultSet
     */
    public function getAllIngredients()
    {
        return $this->db->query("SELECT * FROM ingredients");
    }

    /**
     * Delete ingredient
     * @param $ingredientId
     */
    public function removeIngredient($ingredientId)
    {
        $this->db->query("DELETE FROM ingredients WHERE id = ?", $ingredientId);
    }

    /**
     * Delete ingredient from all products it was assigned to
     * @param $ingredientId
     */
    public function removeIngredientFromAllProducts($ingredientId)
    {
        $this->db->query("DELETE FROM ingredients2product WHERE ingredient_id = ?", $ingredientId);
    }
}