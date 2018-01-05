<?php
/**
 * Created by PhpStorm.
 * User: Viki
 * Date: 19.12.2017
 * Time: 16:21
 */

namespace App\Model;


use Nette\Database\Context;
use Nette\Neon\Exception;
use Nette\Security\AuthenticationException;
use Nette\Security\Passwords;

class UserModel
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
     * Checks if user is registered
     * @param $email
     * @return bool
     * @throws AuthenticationException
     */
    public function isUserRegistered($email)
    {
        $user = $this->db->query('SELECT * FROM user WHERE email = ? ', $email)->fetch();
        if ($user) {
            throw new AuthenticationException('Tento email je již používaný.');
        }
        return false;
    }

    /**
     * User registration
     * @param $userData
     */
    public function register($userData)
    {
        $userData['password'] = Passwords::hash($userData['password']);
        $this->db->query('INSERT INTO user', $userData);
    }

    /**
     * Is email in database for news / offers ?
     * @param $email
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function isEmailSignedForNewsletter($email)
    {
        $isSignedUp = $this->db->query('SELECT * FROM newsletter WHERE email = ?', $email)->fetch();

        return $isSignedUp;
    }

    /**
     * Sign up for emails such as news / offers
     * @param $email
     */
    public function signForNewsletter($email)
    {
        $email = ['email' => $email];
        $this->db->query('INSERT INTO newsletter', $email);
    }

    /**
     * Sign out of receiving emails
     * @param $email
     */
    public function signOutNewsletter($email)
    {
        $this->db->query('DELETE FROM newsletter WHERE email = ?', $email);
    }

    /**
     * @param $data
     */
    public function editUser($data)
    {
        $this->db->query('UPDATE user SET firstname = ?, lastname = ?, email = ?, phone = ?, factory = ?, street = ?, city = ?, postalcode = ? WHERE id = ?',
            $data['firstname'],
            $data['lastname'],
            $data['email'],
            $data['phone'],
            $data['factory'],
            $data['street'],
            $data['city'],
            $data['postalcode'],
            $data['id']
        );
    }

    /**
     * Edit user password
     * @param $password
     * @param $userId
     */
    public function editUserPassword($password, $userId)
    {
        $this->db->query('UPDATE user SET password = ? WHERE id = ?', Passwords::hash($password), $userId);
    }


    /**
     * Returns user by ID
     * @param $userId
     * @return bool|\Nette\Database\IRow|\Nette\Database\Row
     */
    public function getUserById($userId)
    {
        $user = $this->db->query('SELECT * FROM user WHERE id = ?', $userId)->fetch();
        return $user;
    }
}