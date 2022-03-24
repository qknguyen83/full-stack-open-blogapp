describe('blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'nobita123',
      name: 'Nobi Nobita',
      password: '123456789',
    });

    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'shizuka123',
      name: 'Minamoto Shizuka',
      password: '123456789',
    });

    cy.visit('http://localhost:3003');
  });

  it('login form is shown', function () {
    cy.get('html').get('#loginForm');
  });

  describe('login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('nobita123');
      cy.get('#password').type('123456789');
      cy.get('#login').click();

      cy.get('.success')
        .should('contain', 'login successfully')
        .and('have.css', 'color', 'rgb(0, 128, 0)');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('nobita123');
      cy.get('#password').type('123456788');
      cy.get('#login').click();

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.loginUser({
        username: 'nobita123',
        password: '123456789',
      });

      cy.createBlog({
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture...',
        likes: 2,
      });

      cy.createBlog({
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 5,
      });

      cy.createBlog({
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Consider...',
        likes: 1,
      });
    });

    it('a blog can be created', function () {
      cy.contains('create new blog').click();

      cy.get('.title').type('a new blog from cypress');
      cy.get('.author').type('cypress');
      cy.get('.url').type('http://localhost:6969');
      cy.get('.title').parent().find('button').click();

      cy.get('#listOfBlogs').should('contain', 'a new blog from cypress');
    });

    it('users can like a blog', function () {
      cy.contains('TDD harms architecture').parent().as('theBlog');
      cy.get('@theBlog').find('.view').click();
      cy.get('@theBlog').find('.like').click();
      cy.get('.likes').contains('3');
    });

    it('user who created a blog can delete it', function () {
      cy.contains('TDD harms architecture').parent().as('theBlog');
      cy.get('@theBlog').find('.view').click();
      cy.get('@theBlog').find('.delete').click();

      cy.get('.success');
    });

    it('other users cannot delete the blog', function () {
      cy.get('#logout').click();
      cy.loginUser({
        username: 'shizuka123',
        password: '123456789',
      });

      cy.contains('TDD harms architecture').parent().as('theBlog');
      cy.get('@theBlog').find('.view').click();
      cy.get('@theBlog').find('.delete').click();

      cy.get('.error');
    });

    it('blogs are sorted by likes in descending order', function () {
      cy.get('.view').click({ multiple: true });
      cy.get('.blog').then((blogs) => {
        const pattern = /(?<=likes: )[0-9]+/;
        const likesArray = blogs.map((index, blog) =>
          parseInt(blog.innerText.match(pattern)[0])
        );
        const sorted = [...likesArray].sort((a, b) => b - a);
        expect(sorted).to.deep.equal(likesArray.toArray());
      });
    });
  });
});
