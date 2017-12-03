<?php
/**
 * Created by PhpStorm.
 * User: viktorkafka
 * Date: 28/11/2017
 * Time: 09:50
 */

namespace App\Model;

use Nette\Security\AuthenticationException;
use Nette\Security\Identity;

class UserManager extends \Nette\Object implements \Nette\Security\IAuthenticator
{

    /**
     * @var \Nette\Database\Context
     */
    private $db;

    /**
     * UserManager constructor.
     */
    public function __construct(\Nette\Database\Context $db)
    {
        $this->db = $db;
    }

    public function authenticate(array $credentials)
    {
        list($email, $password) = $credentials;
        $user = $this->db->query("SELECT * from user WHERE email = ? ", $email)->fetch();

        if (!$user) {
            throw new AuthenticationException('Uživatelské jméno nebo heslo nesouhlasí.');
        } elseif (!Passwords::verify($password, $user->password)) {
            throw new AuthenticationException('Uživatelské jméno nebo heslo nesouhlasí.');
        }
        $arr = [
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'email' => $user->email,
        ];

        return new Identity($user->id, [], $arr);
    }
}